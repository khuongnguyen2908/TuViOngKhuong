// Server chạy thử trên máy: phục vụ index.html + assets, và /api/gop-y bằng chính worker góp ý (D1 giả lập bằng SQLite).
// Chạy: npm run dev   (mặc định http://localhost:8080; dữ liệu góp ý lưu ở .local/gop-y.db)
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from '../worker/gop-y.mjs';
import { d1Local } from './d1-local.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PORT) || 8080;
await mkdir(join(root, '.local'), { recursive: true });
const env = { DB: d1Local(join(root, '.local', 'gop-y.db')), SALT: 'chay-thu', DUYET_TRUOC: process.env.DUYET_TRUOC || '0' };
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8' };

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  try {
    if (url.pathname === '/api/gop-y') {
      const body = req.method === 'POST' ? await new Promise((ok) => { let b = ''; req.on('data', (c) => { b += c; }); req.on('end', () => ok(b)); }) : undefined;
      const headers = { ...req.headers, 'CF-Connecting-IP': req.socket.remoteAddress || '' };
      const r = await worker.fetch(new Request(url, { method: req.method, headers, body }), env);
      res.writeHead(r.status, Object.fromEntries(r.headers));
      res.end(await r.text());
      return;
    }
    const path = normalize(join(root, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)));
    if (!path.startsWith(root) || /[\\/]\.(local|git)([\\/]|$)/.test(path.slice(root.length - 1))) { res.writeHead(403).end(); return; }
    let data = await readFile(path);
    // Bật góp ý cho bản chạy thử (bản đăng thật lấy địa chỉ từ biến FEEDBACK_ENDPOINT khi ghép trang)
    if (path.endsWith('index.html')) data = String(data).replace(/feedbackEndpoint:\s*''/, "feedbackEndpoint: '/api/gop-y'");
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Không tìm thấy');
  }
}).listen(port, '127.0.0.1', () => console.log(`Chạy thử tại http://localhost:${port}`));
