// Chạy: node --test tests/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const L = require('../src/lunar.js');
globalThis.LunarVN = L;
const E = require('../src/engine.js');
const AI = require('../src/ai.js');
const cal = L.makeCalendar(7);

test('Tết âm lịch Việt Nam, kể cả những năm lệch với lịch Trung Quốc', () => {
  const tet = (y) => { for (let d = L.jdn(15, 1, y); ; d++) { const s = L.fromJdn(d); const r = cal.solarToLunar(s.day, s.month, s.year); if (r.day === 1 && r.month === 1 && !r.leap) return `${s.day}/${s.month}`; } };
  assert.equal(tet(1985), '21/1'); // Trung Quốc: 20/2
  assert.equal(tet(2007), '17/2'); // Trung Quốc: 18/2
  assert.equal(tet(2030), '2/2');  // Trung Quốc: 3/2
  assert.equal(tet(2053), '18/2'); // Trung Quốc: 19/2
  assert.equal(tet(2026), '17/2');
});

test('Tháng nhuận', () => {
  assert.equal(cal.leapMonthOf(2023), 2);
  assert.equal(cal.leapMonthOf(2025), 6);
  assert.equal(cal.leapMonthOf(2024), 0);
});

test('Đổi dương → âm → dương khớp lại từng ngày 1900–2100 (lấy mẫu)', () => {
  for (let j = L.jdn(1, 1, 1900); j < L.jdn(31, 12, 2100); j += 3) {
    const s = L.fromJdn(j);
    const r = cal.solarToLunar(s.day, s.month, s.year);
    const back = cal.lunarToSolar(r.day, r.month, r.year, r.leap);
    assert.ok(back && back.jdn === j, `${s.day}/${s.month}/${s.year}`);
  }
});

// Lá số mẫu: nam, 29/08/1998 giờ Thân, năm xem 2026 — đối chiếu với lá số Việt in sẵn
const GOLDEN = {
  0: 'Mệnh|4|Tuất|Tử|3|Thái Dương(H);Văn Khúc,Hỷ Thần,Điếu Khách',
  1: 'Phụ Mẫu|14|Hợi|Mộ|4|Thiên Phủ(B);Thiên Khôi,Hồng Loan,Quốc Ấn,Địa Giải,Bệnh Phù,Trực Phù,Quả Tú',
  2: 'Phúc Đức|24|Tý|Tuyệt|5|Thiên Cơ(H),Thái Âm(H);Văn Xương,Hóa Quyền,Thiên Tài,Thai Phụ,Thiên Giải,Hóa Kỵ,Đại Hao,Thái Tuế',
  3: 'Điền Trạch|34|Sửu|Thai|6|Tử Vi(B),Tham Lang(H);Hóa Lộc,Thiếu Dương,Thiên Quan,Thiên Phúc,Đào Hoa,Thiên Không,Địa Không,Phục Binh,Thiên Hình',
  4: 'Quan Lộc|44|Dần|Dưỡng|7|Cự Môn(H);Hữu Bật,Hóa Khoa,Đà La,Quan Phủ,Tang Môn,Thiên Khốc,Thiên La,Đẩu Quân',
  5: 'Nô Bộc|54|Mão|Tràng Sinh|8|Thiên Tướng(Đ);Lộc Tồn,Bác Sĩ,Thiếu Âm,Tam Thai,Cô Thần,Thiên Thương,Lưu Hà',
  6: 'Thiên Di|64|Thìn|Mộc Dục|9|Thiên Lương(M);Lực Sĩ,Long Trì,Thiên Quý,Thiên Thọ,Thiên Trù,Kình Dương,Quan Phù',
  7: 'Tật Ách|74|Tỵ|Quan Đới|10|Liêm Trinh(Đ),Thất Sát(Đ);Thiên Việt,Thanh Long,Nguyệt Đức,Thiên Hỷ,Thiên Y,Địa Kiếp,Linh Tinh,Tử Phù,Thiên Riêu,Thiên Sứ',
  8: 'Tài Bạch|84|Ngọ|Lâm Quan|11|;Phượng Các,Giải Thần,Ân Quang,Văn Tinh,Thiên Mã,Tiểu Hao,Tuế Phá,Thiên Hư',
  9: 'Tử Tức|94|Mùi|Đế Vượng|12|;Long Đức,Bát Tọa,Hỏa Tinh,Tướng Quân,Phá Toái',
  10: 'Phu Thê|104|Thân|Suy|1|Thiên Đồng(H);Tả Phù,Tấu Thư,Đường Phù,Phong Cáo,Hoa Cái,Bạch Hổ,Địa Võng',
  11: 'Huynh Đệ|114|Dậu|Bệnh|2|Vũ Khúc(H),Phá Quân(H);Phúc Đức,Thiên Đức,Phi Liêm,Kiếp Sát',
};

test('Lá số mẫu khớp 12/12 cung', () => {
  const r = E.compute({ gender: 'nam', calendar: 'duong', day: 29, month: 8, year: 1998, hour: 15, minute: 30, namXem: 2026 });
  const tb = r.thienBan;
  assert.equal(tb.canChi.nam, 'Mậu Dần');
  assert.equal(tb.canChi.gio, 'Canh Thân');
  assert.equal(tb.banMenh, 'Thành Đầu Thổ');
  assert.equal(tb.cucTen, 'Kim tứ cục');
  assert.deepEqual(tb.tuan, [8, 9]);
  assert.deepEqual(tb.triet, [0, 1]);
  for (const p of r.palaces) {
    const [cung, dh, th, ts, ln, st] = GOLDEN[p.chi].split('|');
    const [chinh, phu] = st.split(';');
    assert.equal(p.cung, cung); assert.equal(p.daiHan, +dh); assert.equal(p.tieuHanTen, th);
    assert.equal(p.trangSinh, ts); assert.equal(p.luuNguyet, +ln);
    const expected = [...(chinh ? chinh.split(',') : []), ...phu.split(',')].map((x) => x.replace(/\(.\)/, '')).sort();
    assert.deepEqual(p.stars.map((s) => s.name).sort(), expected, `cung ${p.cung}`);
    for (const m of (chinh ? chinh.split(',') : [])) {
      const [, name, b] = m.match(/(.*)\((.)\)/);
      assert.equal(p.stars.find((s) => s.name === name).bright, b, `${name} tại ${p.cung}`);
    }
  }
});

test('Báo lỗi ngày không tồn tại', () => {
  assert.throws(() => E.compute({ gender: 'nam', calendar: 'duong', day: 30, month: 2, year: 2023, hour: 8, minute: 0 }));
  assert.throws(() => E.compute({ gender: 'nam', calendar: 'am', day: 15, month: 3, year: 2023, leap: true, hour: 8, minute: 0 }));
});

test('Proxy AI đọc đúng luồng sự kiện', async () => {
  const events = [
    { type: 'message_start' },
    { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Xin ' } },
    { type: 'content_block_delta', delta: { type: 'text_delta', text: 'chào' } },
    { type: 'message_delta', delta: { stop_reason: 'end_turn' } },
  ];
  const sse = events.map((e) => `event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join('');
  const orig = globalThis.fetch;
  globalThis.fetch = async () => new Response(new Blob([sse]).stream(), { status: 200 });
  try {
    const seen = [];
    const out = await AI.proxySample('https://example.test')('hỏi', { onText: ({ text }) => seen.push(text) });
    assert.equal(out.text, 'Xin chào');
    assert.deepEqual(seen, ['Xin ', 'Xin chào']);
  } finally { globalThis.fetch = orig; }
});

test('Cân lượng, lai nhân, âm dương cung khớp lá số tracuutuvi.com', () => {
  const r = E.compute({ gender: 'nam', calendar: 'duong', day: 29, month: 8, year: 1998, hour: 16, minute: 30, namXem: 2026 });
  assert.equal(r.thienBan.canXuongTen, '4 lượng 1 chỉ');
  assert.equal(r.thienBan.laiNhan, 'Thiên Di');
  assert.equal(r.thienBan.banMenhNghia, 'Đất trên thành');
  assert.equal(r.palaces[0].amDuong, 1);
  assert.equal(r.palaces[1].amDuong, -1);
  const tham = r.palaces[3].stars.find((s) => s.name === 'Tham Lang');
  assert.equal(tham.amDuong, -1); assert.equal(tham.hanh, 'Mộc');
  assert.equal(r.palaces[8].stars.find((s) => s.name === 'Thiên Mã').bright, 'H');
});
