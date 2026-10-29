// Cloudflare Worker: proxy cho Luận giải AI khi web chạy ngoài Claude (GitHub Pages...).
// Giữ API key ở phía máy chủ; trình duyệt chỉ gửi nội dung lá số và nhận lại luồng văn bản.
//
// Biến môi trường (wrangler secret / vars):
//   ANTHROPIC_API_KEY  (bắt buộc, secret)  khóa Claude API
//   ALLOWED_ORIGINS    (nên đặt)           ví dụ "https://ten-ban.github.io"; để trống = cho mọi nguồn
//   MODEL              (tùy chọn)          mặc định "claude-sonnet-5-5"
//   MAX_TOKENS         (tùy chọn)          mặc định 1800
// Binding tùy chọn RATE_LIMITER (Cloudflare Rate Limiting) để giới hạn số lần gọi mỗi IP.

const MAX_BODY_CHARS = 200_000;
const MAX_MESSAGES = 16;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const allowOrigin = allowed.length === 0 ? '*' : (allowed.includes(origin) ? origin : '');
    const cors = {
      'Access-Control-Allow-Origin': allowOrigin || 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
      'Vary': 'Origin',
    };
    const reply = (status, message) => new Response(JSON.stringify({ error: message }), { status, headers: { ...cors, 'content-type': 'application/json' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return reply(405, 'Chỉ nhận POST');
    if (!allowOrigin) return reply(403, 'Nguồn không được phép');
    if (!env.ANTHROPIC_API_KEY) return reply(500, 'Chưa cấu hình ANTHROPIC_API_KEY');

    if (env.RATE_LIMITER) {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return reply(429, 'Quá nhiều yêu cầu, thử lại sau');
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) return reply(413, 'Nội dung quá dài');
    let body;
    try { body = JSON.parse(raw); } catch { return reply(400, 'JSON không hợp lệ'); }
    const messages = Array.isArray(body.messages) ? body.messages : null;
    const valid = messages && messages.length > 0 && messages.length <= MAX_MESSAGES
      && messages.every((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.length > 0)
      && messages[0].role === 'user' && messages[messages.length - 1].role === 'user';
    if (!valid) return reply(400, 'messages không hợp lệ');

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: env.MODEL || 'claude-sonnet-5-5',
        max_tokens: Number(env.MAX_TOKENS) || 1800,
        stream: true,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const status = upstream.status === 429 ? 429 : 502;
      return reply(status, 'Claude API trả lỗi ' + upstream.status);
    }
    return new Response(upstream.body, {
      status: 200,
      headers: { ...cors, 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache' },
    });
  },
};
