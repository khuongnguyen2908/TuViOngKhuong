// Luận giải AI khi chạy ngoài Claude: gọi proxy (worker/ai-proxy.js) và đọc luồng sự kiện của Claude API.
// Trả về hàm cùng dạng với claude.use('sample'): (input, {signal, onText}) => Promise<{text, truncated}>.
const TuViAI = (() => {
  function proxySample(endpoint) {
    return async (input, opts = {}) => {
      const messages = typeof input === 'string' ? [{ role: 'user', content: input }] : input;
      let res;
      try {
        res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages }), signal: opts.signal });
      } catch (e) { throw { code: e && e.name === 'AbortError' ? 'cancelled' : 'upstream_error' }; }
      if (!res.ok || !res.body) throw { code: res.status === 429 ? 'rate_limited' : 'upstream_error' };
      const reader = res.body.getReader(), dec = new TextDecoder();
      let buf = '', text = '', truncated = false;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const parts = buf.split('\n\n'); buf = parts.pop();
          for (const part of parts) {
            const line = part.split('\n').find((l) => l.startsWith('data:'));
            if (!line) continue;
            let ev; try { ev = JSON.parse(line.slice(5)); } catch { continue; }
            if (ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta') {
              text += ev.delta.text; if (opts.onText) opts.onText({ text, delta: ev.delta.text });
            } else if (ev.type === 'message_delta' && ev.delta && ev.delta.stop_reason === 'max_tokens') truncated = true;
            else if (ev.type === 'error') throw { code: ev.error && ev.error.type === 'rate_limit_error' ? 'rate_limited' : 'upstream_error', text };
          }
        }
      } catch (e) { if (e && e.name === 'AbortError') throw { code: 'cancelled', text }; throw e.code ? e : { code: 'upstream_error', text }; }
      if (!text.trim()) throw { code: 'empty_completion' };
      return { text, truncated };
    };
  }
  return { proxySample };
})();
if (typeof module !== 'undefined') module.exports = TuViAI;
