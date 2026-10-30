// Cloudflare Worker: nhận và trả góp ý (tên, số sao, nội dung), lưu trong D1.
//
//   GET  → { tong, trungBinh, dem: {1..5}, items: [{ id, ten, sao, noiDung, luc }], conNua }
//          mới nhất trước, mỗi lần 20; ?truoc=<id> để lấy tiếp
//   POST → body JSON { ten, sao, noiDung, web } (web là ô bẫy, người thật để trống)
//          → { ok, item, choDuyet }
//
// Binding: DB (D1, bảng ở gop-y.sql). Biến:
//   ALLOWED_ORIGINS (nên đặt)  domain trang web, nhiều domain cách nhau bằng dấu phẩy; trống = cho mọi nguồn
//   DUYET_TRUOC     (tùy chọn) "1" = góp ý mới ẩn cho tới khi duyệt
//   SALT            (secret)   chuỗi bí mật để băm IP
// Không lưu IP gốc; IP băm chỉ dùng để chặn gửi dồn (tối đa 3 lần trong 10 phút).

const TOI_DA = { ten: 40, noiDung: 1000 };
const MOI_TRANG = 20;
const GIOI_HAN = { lan: 3, phut: 10 };

const sach = (s, max) => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);

async function bam(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const allowOrigin = allowed.length === 0 ? '*' : (allowed.includes(origin) ? origin : '');
    const cors = { 'Access-Control-Allow-Origin': allowOrigin || 'null', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type', 'Vary': 'Origin' };
    const json = (status, data) => new Response(JSON.stringify(data), { status, headers: { ...cors, 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (origin && !allowOrigin) return json(403, { error: 'Nguồn không được phép' });
    if (!env.DB) return json(500, { error: 'Chưa gắn cơ sở dữ liệu DB' });

    if (request.method === 'GET') {
      const truoc = Number(new URL(request.url).searchParams.get('truoc')) || null;
      const rows = (await env.DB.prepare(`SELECT id, ten, sao, noi_dung, luc FROM gop_y WHERE hien = 1 ${truoc ? 'AND id < ?' : ''} ORDER BY id DESC LIMIT ?`)
        .bind(...(truoc ? [truoc, MOI_TRANG + 1] : [MOI_TRANG + 1])).all()).results || [];
      const tk = (await env.DB.prepare('SELECT sao, COUNT(*) AS n FROM gop_y WHERE hien = 1 GROUP BY sao').all()).results || [];
      const dem = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      tk.forEach((r) => { dem[r.sao] = r.n; });
      const tong = Object.values(dem).reduce((a, b) => a + b, 0);
      const trungBinh = tong ? Math.round((Object.entries(dem).reduce((s, [k, n]) => s + k * n, 0) / tong) * 10) / 10 : 0;
      return json(200, { tong, trungBinh, dem, conNua: rows.length > MOI_TRANG,
        items: rows.slice(0, MOI_TRANG).map((r) => ({ id: r.id, ten: r.ten, sao: r.sao, noiDung: r.noi_dung, luc: r.luc })) });
    }

    if (request.method !== 'POST') return json(405, { error: 'Chỉ nhận GET hoặc POST' });
    const raw = await request.text();
    if (raw.length > 8000) return json(413, { error: 'Nội dung quá dài' });
    let body;
    try { body = JSON.parse(raw); } catch { return json(400, { error: 'Dữ liệu không hợp lệ' }); }
    // Ô bẫy: bot hay điền mọi ô; trả về như thành công để bot không dò ra
    if (body.web) return json(200, { ok: true, choDuyet: true });
    const ten = sach(body.ten, TOI_DA.ten), noiDung = sach(body.noiDung, TOI_DA.noiDung), sao = Number(body.sao);
    if (!ten) return json(400, { error: 'Nhập tên của bạn' });
    if (!Number.isInteger(sao) || sao < 1 || sao > 5) return json(400, { error: 'Chọn từ 1 đến 5 sao' });
    if (noiDung.length < 3) return json(400, { error: 'Viết vài chữ góp ý nhé' });
    if ((noiDung.match(/https?:\/\//gi) || []).length > 2) return json(400, { error: 'Góp ý có quá nhiều đường link' });

    const ipBam = await bam((env.SALT || 'tuvi') + '|' + (request.headers.get('CF-Connecting-IP') || 'khong-ro'));
    const luc = Date.now();
    const gan = await env.DB.prepare('SELECT COUNT(*) AS n FROM gop_y WHERE ip_bam = ? AND luc > ?').bind(ipBam, luc - GIOI_HAN.phut * 60000).first();
    if (gan && gan.n >= GIOI_HAN.lan) return json(429, { error: `Bạn đã gửi ${GIOI_HAN.lan} góp ý gần đây, thử lại sau ít phút` });

    const choDuyet = env.DUYET_TRUOC === '1';
    const kq = await env.DB.prepare('INSERT INTO gop_y (ten, sao, noi_dung, luc, hien, ip_bam) VALUES (?, ?, ?, ?, ?, ?)').bind(ten, sao, noiDung, luc, choDuyet ? 0 : 1, ipBam).run();
    return json(200, { ok: true, choDuyet, item: { id: kq.meta && kq.meta.last_row_id, ten, sao, noiDung, luc } });
  },
};
