// Ghép src/ thành một file index.html duy nhất (không cần thư viện ngoài).
// Chạy: node scripts/build.mjs                         → index.html (đầy đủ)
//       node scripts/build.mjs out.html --fragment    → bản cho artifact Claude
//       AI_ENDPOINT=https://... node scripts/build.mjs   → bật Luận giải AI qua proxy
//       FEEDBACK_ENDPOINT=https://... node scripts/build.mjs → bật nút Góp ý
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(join(root, 'src', f), 'utf8');
const stripExports = (s) => s.replace(/^if \(typeof module !== 'undefined'\) module\.exports = \w+;\s*$/m, '');

let config = read('config.js');
if (process.env.AI_ENDPOINT) {
  config = config.replace(/aiEndpoint:\s*'[^']*'/, `aiEndpoint: ${JSON.stringify(process.env.AI_ENDPOINT).replace(/"/g, "'")}`);
}
if (process.env.FEEDBACK_ENDPOINT) {
  config = config.replace(/feedbackEndpoint:\s*'[^']*'/, `feedbackEndpoint: ${JSON.stringify(process.env.FEEDBACK_ENDPOINT).replace(/"/g, "'")}`);
}

const parts = {
  CSS: read('styles.css'),
  CONFIG: config,
  LUNAR: stripExports(read('lunar.js')),
  ENGINE: stripExports(read('engine.js')),
  CONTENT: stripExports(read('content.js')),
  CACHCUC: stripExports(read('cachcuc.js')),
  NGHIASAO: stripExports(read('nghiasao.js')),
  LOIKHUYEN: stripExports(read('loikhuyen.js')),
  SOSANH: stripExports(read('sosanh.js')),
  BATTU: stripExports(read('battu.js')),
  BANDOSAO: stripExports(read('bandosao.js')),
  SAONGHIA: stripExports(read('bandosao-nghia.js')),
  TONGHOP: stripExports(read('tonghop.js')),
  THANSO: stripExports(read('thansohoc.js')),
  AI: stripExports(read('ai.js')),
  APP: read('app.js'),
};
let html = read('template.html');
for (const [k, v] of Object.entries(parts)) {
  const token = `/*${k}*/`;
  if (!html.includes(token)) throw new Error(`Thiếu ${token} trong template.html`);
  html = html.replace(token, () => v);
}
// Mặc định xuất tài liệu HTML đầy đủ (GitHub Pages, mở trực tiếp).
// --fragment: chỉ phần nội dung, dùng khi đăng làm artifact trong Claude (Claude tự bọc khung trang).
const args = process.argv.slice(2);
const fragment = args.includes('--fragment');
const out = args.find((a) => !a.startsWith('--')) || join(root, 'index.html');
if (!fragment) {
  const cut = html.indexOf('<header');
  html = '<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + html.slice(0, cut) + '</head>\n<body>\n' + html.slice(cut) + '\n</body>\n</html>\n';
}
writeFileSync(out, html);
console.log(`Đã ghi ${out} (${(html.length / 1024).toFixed(0)} KB)`);
