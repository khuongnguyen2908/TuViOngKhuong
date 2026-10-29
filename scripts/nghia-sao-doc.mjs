// Tạo docs/nghia-sao.md từ src/nghiasao.js: trang để người am hiểu đọc duyệt kho nghĩa sao mà không phải mở code.
// Chạy: node scripts/nghia-sao-doc.mjs (npm run build cũng tự chạy).
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const N = require(join(root, 'src', 'nghiasao.js'));
const C = require(join(root, 'src', 'content.js'));

const cell = (s) => String(s).replace(/\|/g, '\\|');
const out = [
  '# Kho nghĩa sao theo cung',
  '',
  'Trang này tạo tự động từ `src/nghiasao.js` (đừng sửa tay ở đây; sửa trong file đó rồi chạy `npm run build`).',
  'Lời tự biên soạn theo ý nghĩa phổ biến, mang tính tham khảo. Ô nào đã sửa theo sách thì ghi tên sách vào `NGUON` trong file đó.',
  'Trên web, sau câu theo cung còn có một câu theo thế sáng / hãm (ghi ngay dưới tên sao bên dưới) và dòng "Tính chất chung".',
  '',
  '## Mục lục',
  '',
  Object.keys(N.CHINH_CUNG).map((s) => `[${s}](#${s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/\s+/g, '-')})`).join(' · '),
  '',
];
for (const [sao, byCung] of Object.entries(N.CHINH_CUNG)) {
  const inf = C.CHINH[sao];
  out.push(`## ${sao}`, '', `Tính chất chung: ${inf[0]}`, '', `Khi sáng (miếu, vượng, đắc): ${inf[1]}. Khi hãm: ${inf[2]}.`, '');
  out.push('| Cung | Nghĩa | Nguồn |', '| --- | --- | --- |');
  N.CUNG.forEach((cung) => out.push(`| ${cung} | ${cell(byCung[cung] || '(chưa có)')} | ${cell(N.nguon(sao, cung))} |`));
  out.push('');
}
mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs', 'nghia-sao.md'), out.join('\n'));
console.log('Đã ghi docs/nghia-sao.md');
