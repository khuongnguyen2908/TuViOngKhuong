// Chạy: node --test tests/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const L = require('../src/lunar.js');
globalThis.LunarVN = L;
const E = require('../src/engine.js');
const AI = require('../src/ai.js');
const K = require('../src/cachcuc.js');
const N = require('../src/nghiasao.js');
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

// Lá số ngẫu nhiên có seed (mulberry32) cho các bài thử cách cục
function laSoNgauNhien(n, seed = 2026) {
  let s = seed;
  const rnd = (k) => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) % k; };
  return Array.from({ length: n }, () => E.compute({ gender: rnd(2) ? 'nam' : 'nu', calendar: 'duong', day: 1 + rnd(28), month: 1 + rnd(12), year: 1940 + rnd(80), hour: rnd(24), minute: rnd(60), namXem: 2026 }));
}

test('Cách cục: lá số mẫu ra khung Cự Nhật', () => {
  const r = K.detect(E.compute({ gender: 'nam', calendar: 'duong', day: 29, month: 8, year: 1998, hour: 15, minute: 30, namXem: 2026 }));
  assert.deepEqual(r.khung.map((x) => x.ten), ['Cự Nhật']);
  assert.equal(r.khung[0].canCu, 'Mệnh (Tý): Thái Dương; Quan Lộc (Thìn): Cự Môn');
  assert.deepEqual(r.cach, []);
});

test('Cách cục: mỗi cách đều gặp được, không cách nào quá phổ biến, căn cứ đầy đủ', () => {
  const charts = laSoNgauNhien(3000);
  const dem = Object.fromEntries(K.RULES.map((r) => [r.id, 0]));
  let coKhung = 0;
  charts.forEach((ch) => {
    const r = K.detect(ch), m = ch.thienBan.menhCung, ids = r.cach.map((h) => h.id);
    if (r.khung.length) coKhung++;
    [...r.khung, ...r.cach].forEach((h) => {
      assert.ok(h.cung.includes(m), `${h.ten}: thiếu cung Mệnh trong danh sách tô sáng`);
      assert.ok(h.canCu.length > 0, `${h.ten}: thiếu căn cứ`);
      assert.ok(h.nghia.length > 0, `${h.ten}: thiếu nghĩa`);
    });
    ids.forEach((id) => { dem[id]++; });
    // Cách lớn che cách nhỏ
    assert.ok(!(ids.includes('tamKyGiaHoi') && ids.includes('quyenLocHoiMenh')));
    assert.ok(!(ids.includes('minhChauXuatHai') && ids.includes('menhVoChinhDieu')));
    // Cách đòi không có tứ sát thì không bị ghi "phá" bởi tứ sát
    r.cach.filter((h) => ['cucHuongLyMinh', 'hungTuTrieuVien'].includes(h.id))
      .forEach((h) => assert.ok(!h.pha.some((n) => ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'].includes(n))));
  });
  // Hình Tù giáp Ấn hiếm (~0,2 %) nên không bắt buộc gặp trong 3.000 lá số
  Object.entries(dem).forEach(([id, n]) => {
    if (id !== 'hinhTuGiapAn') assert.ok(n > 0, `Không lá số nào có cách ${id}`);
    assert.ok(n / charts.length < 0.2, `Cách ${id} quá phổ biến: ${(100 * n / charts.length).toFixed(1)} %`);
  });
  // Mệnh có chính tinh thì luôn có khung (bộ chính tinh hoặc khung pha); vô chính diệu thì mượn cung xung chiếu
  assert.equal(coKhung, charts.length);
});

test('Sao lưu đại hạn: lá số mẫu năm 2026 (đại hạn Phúc Đức, Giáp Dần)', () => {
  const r = E.compute({ gender: 'nam', calendar: 'duong', day: 29, month: 8, year: 1998, hour: 15, minute: 30, namXem: 2026 });
  assert.equal(r.thienBan.daiVanCanChi, 'Giáp Dần');
  const dv = Object.fromEntries(r.palaces.filter((p) => p.daiVan.length).map((p) => [p.chiTen, p.daiVan.join(', ')]));
  assert.deepEqual(dv, {
    'Tý': 'ĐV.Hóa Kỵ', 'Sửu': 'ĐV.Đà La', 'Dần': 'ĐV.Lộc Tồn', 'Mão': 'ĐV.Kình Dương',
    'Mùi': 'ĐV.Hóa Lộc', 'Thân': 'ĐV.Thiên Mã', 'Hợi': 'ĐV.Hóa Quyền, ĐV.Hóa Khoa',
  });
});

test('Đổi năm xem: lá số gốc giữ nguyên, sao lưu đại hạn đổi theo đại hạn', () => {
  const base = { gender: 'nu', calendar: 'duong', day: 3, month: 2, year: 1985, hour: 7, minute: 10 };
  const goc = (r) => JSON.stringify(r.palaces.map((p) => [p.cung, p.daiHan, p.trangSinh, p.stars]));
  const first = E.compute({ ...base, namXem: 1990 });
  for (let y = 1985; y <= 2080; y++) {
    const r = E.compute({ ...base, namXem: y }), tb = r.thienBan;
    assert.equal(goc(r), goc(first), `Lá số gốc đổi khi xem năm ${y}`);
    const n = r.palaces.reduce((s, p) => s + p.daiVan.length, 0);
    if (tb.daiHanCung === null) { assert.equal(n, 0); assert.equal(tb.daiVanCanChi, null); continue; }
    assert.equal(n, 8, `Năm ${y}: cần đủ 8 sao ĐV.`);
    // Cùng một đại hạn thì sao ĐV. giống hệt nhau
    const cungNam = E.compute({ ...base, namXem: y - (tb.tuoi - r.palaces[tb.daiHanCung].daiHan) });
    assert.deepEqual(r.palaces.map((p) => p.daiVan), cungNam.palaces.map((p) => p.daiVan));
  }
});

test('Kho nghĩa sao: đủ 14 chính tinh × 12 cung, độ dài hợp lý, không phán tuyệt đối', () => {
  assert.deepEqual(N.CUNG, E.CUNG);
  assert.deepEqual(Object.keys(N.CHINH_CUNG).sort(), [...E.CHINH_TINH].sort());
  const CAM = /chắc chắn sẽ|nhất định sẽ|tuyệt mệnh|chết|yểu|ung thư|tai họa lớn|không thể tránh/i;
  for (const sao of E.CHINH_TINH) {
    assert.deepEqual(Object.keys(N.CHINH_CUNG[sao]), E.CUNG, `${sao}: thiếu cung hoặc sai thứ tự`);
    for (const cung of E.CUNG) {
      const t = N.CHINH_CUNG[sao][cung];
      assert.ok(t.length >= 60 && t.length <= 400, `${sao} ở ${cung}: dài ${t.length} ký tự`);
      assert.ok(!CAM.test(t), `${sao} ở ${cung}: có từ phán tuyệt đối`);
    }
  }
  // Nguồn chỉ ghi cho ô có thật: 'Chính tinh|Cung', 'Phụ tinh chủ chốt|Nhóm cung' hoặc 'Phụ tinh khác|chung'
  Object.keys(N.NGUON).forEach((k) => {
    const [s, c] = k.split('|');
    assert.ok(N.cungOf(s, c) || (N.PHU_NHOM[s] && N.PHU_NHOM[s][c]) || (c === 'chung' && N.PHU_DAI[s]), `NGUON có khóa lạ: ${k}`);
  });
});

test('Kho nghĩa sao: phụ tinh đủ, không trùng, độ dài hợp lý', () => {
  const C = require('../src/content.js');
  const nhom = Object.keys(N.PHU_NHOM), dai = Object.keys(N.PHU_DAI);
  assert.equal(nhom.length, 26);
  assert.deepEqual([...nhom, ...dai].sort(), Object.keys(C.PHU).sort(), 'Mỗi phụ tinh phải có đúng một chỗ: PHU_NHOM hoặc PHU_DAI');
  assert.deepEqual(Object.values(N.NHOM).flat().sort(), [...E.CUNG].sort(), '4 nhóm phải phủ đủ 12 cung, không trùng');
  const CAM = /chắc chắn sẽ|nhất định sẽ|tuyệt mệnh|chết|yểu|ung thư|tai họa lớn|không thể tránh/i;
  const kiem = (t, ten) => { assert.ok(t.length >= 40 && t.length <= 400, `${ten}: dài ${t.length} ký tự`); assert.ok(!CAM.test(t), `${ten}: có từ phán tuyệt đối`); };
  nhom.forEach((s) => Object.keys(N.NHOM).forEach((g) => { assert.ok(N.PHU_NHOM[s][g], `${s}: thiếu nhóm ${g}`); kiem(N.PHU_NHOM[s][g], `${s} / ${g}`); }));
  dai.forEach((s) => kiem(N.PHU_DAI[s], s));
  assert.equal(N.phuCungOf('Hóa Kỵ', 'Phu Thê'), N.PHU_NHOM['Hóa Kỵ']['Người thân, bạn bè']);
});

test('Cách cục: cát và hung không lệch quá (hung ít nhất 70 % số cát)', () => {
  const dem = { cat: 0, hung: 0 };
  laSoNgauNhien(2000, 77).forEach((ch) => K.detect(ch).cach.forEach((h) => { if (h.nhom in dem) dem[h.nhom]++; }));
  assert.ok(dem.hung >= 0.7 * dem.cat, `Cát ${dem.cat}, hung ${dem.hung}: lệch về cát`);
});

test('Lời khuyên: đủ cho mọi hung cách, chính tinh hãm, hung tinh; không phán tuyệt đối', () => {
  const LK = require('../src/loikhuyen.js');
  const CAM = /chắc chắn sẽ|nhất định sẽ|tuyệt mệnh|chết|yểu|ung thư|tai họa lớn|không thể tránh/i;
  const kiem = (t, ten) => { assert.ok(typeof t === 'string' && t.length >= 40 && t.length <= 300, `${ten}: dài ${t && t.length} ký tự`); assert.ok(!CAM.test(t), `${ten}: có từ phán tuyệt đối`); };
  const ids = K.RULES.map((r) => r.id);
  K.RULES.filter((r) => r.nhom === 'hung').forEach((r) => assert.ok(LK.CACH[r.id], `Thiếu lời khuyên cho hung cách ${r.ten}`));
  Object.keys(LK.CACH).forEach((id) => { assert.ok(ids.includes(id), `CACH có id lạ: ${id}`); kiem(LK.CACH[id], id); });
  kiem(LK.PHA, 'PHA');
  assert.deepEqual(Object.keys(LK.CHINH_HAM).sort(), [...E.CHINH_TINH].sort());
  Object.entries(LK.CHINH_HAM).forEach(([k, t]) => kiem(t, k));
  const hung = new Set(laSoNgauNhien(400, 9).flatMap((ch) => ch.palaces.flatMap((p) => p.stars.filter((s) => s.kind === 'hung').map((s) => s.name))));
  hung.forEach((n) => assert.ok(LK.SAO[n], `Thiếu lời khuyên cho hung tinh ${n}`));
  Object.entries(LK.SAO).forEach(([k, t]) => kiem(t, k));
  Object.entries({ ...LK.TONG, ...LK.SO_SANH }).forEach(([k, t]) => kiem(t, k));
  const tb = laSoNgauNhien(200, 3).map((ch) => ch.thienBan);
  ['Cục khắc Bản Mệnh', 'Âm dương nghịch lý'].forEach((k) => assert.ok(tb.some((t) => t.quanHeMenhCuc === k || t.amDuongLy === k), `Khóa TONG không khớp engine: ${k}`));
});

test('So sánh: quan hệ chi, can, ngũ hành và đối xứng hai chiều', () => {
  const SS = require('../src/sosanh.js');
  const LK = require('../src/loikhuyen.js');
  const q = (a, b) => SS.chiQuanHe(a, b).loai;
  assert.equal(q(0, 4), 'tamHop'); assert.equal(q(8, 0), 'tamHop');      // Tý Thìn, Thân Tý
  assert.equal(q(0, 1), 'lucHop'); assert.equal(q(5, 8), 'lucHop');      // Tý Sửu, Tỵ Thân
  assert.equal(q(0, 6), 'xung'); assert.equal(q(2, 8), 'xung');          // Tý Ngọ, Dần Thân
  assert.equal(q(0, 7), 'hai'); assert.equal(q(9, 10), 'hai');           // Tý Mùi, Dậu Tuất
  assert.equal(q(0, 3), 'khac'); assert.equal(q(4, 4), 'trung');
  const la = (year, month = 6, hour = 10) => E.compute({ gender: 'nam', calendar: 'duong', day: 15, month, year, hour, minute: 0, namXem: 2026 });
  const muc = (r, k) => r.muc.find((x) => x.key === k);
  // 1984 Giáp Tý (Hải Trung Kim), 1989 Kỷ Tỵ (Đại Lâm Mộc), 1990 Canh Ngọ (Lộ Bàng Thổ), 1992 Nhâm Thân (Kiếm Phong Kim)
  assert.equal(muc(SS.compare(la(1984), la(1989)), 'can').muc, 'hop');   // Giáp Kỷ ngũ hợp
  assert.equal(muc(SS.compare(la(1984), la(1990)), 'can').muc, 'ky');    // Giáp Canh xung
  assert.equal(muc(SS.compare(la(1984), la(1990)), 'chi').muc, 'ky');    // Tý Ngọ xung
  assert.equal(muc(SS.compare(la(1984), la(1992)), 'chi').muc, 'hop');   // Tý Thân tam hợp
  assert.equal(muc(SS.compare(la(1984), la(1992)), 'nguHanh').muc, 'binh'); // Kim Kim
  assert.equal(muc(SS.compare(la(1984), la(1989)), 'nguHanh').muc, 'ky'); // Kim khắc Mộc
  // Đổi chỗ hai người thì số hợp / bình / kỵ không đổi; mục kỵ nào cũng có lời khuyên
  const ds = laSoNgauNhien(300, 41);
  for (let i = 0; i + 1 < ds.length; i += 2) {
    const r1 = SS.compare(ds[i], ds[i + 1]), r2 = SS.compare(ds[i + 1], ds[i]);
    assert.deepEqual(r1.dem, r2.dem);
    r1.muc.filter((x) => x.muc === 'ky').forEach((x) => assert.ok(LK.SO_SANH[x.khuyen], `Mục kỵ ${x.key} thiếu lời khuyên`));
  }
  // Không rõ giờ: bỏ mục cung Mệnh và cung liên quan của người đó
  const r = SS.compare(la(1984), la(1992), { gioB: false, quanHe: 'vochong' });
  assert.ok(!muc(r, 'menh'));
  assert.ok(r.thieuGio);
  assert.deepEqual(r.lienQuan.map((x) => x.nguoi), ['Người thứ nhất']);
});

test('Bát Tự: khớp ba lá số đối chiếu với bazi.vn (trụ, Thai nguyên, Mệnh cung, đại vận)', () => {
  globalThis.TuViEngine = E;
  const BT = require('../src/battu.js');
  const lap = (i) => BT.compute({ calendar: 'duong', namXem: 2026, ...i });
  const mau = [
    // Nam, năm dương: đại vận thuận
    [{ gender: 'nam', day: 29, month: 8, year: 1998, hour: 10, minute: 30 }, 'Mậu Dần|Canh Thân|Mậu Thân|Đinh Tỵ', 'Tân Hợi', 'Ất Mão', 'Tân Dậu', 2001, 4],
    // Nữ, năm âm, sinh 2 giờ sau Lập Xuân: đã sang năm Ất Sửu, đại vận thuận
    [{ gender: 'nu', day: 4, month: 2, year: 1985, hour: 6, minute: 0 }, 'Ất Sửu|Mậu Dần|Giáp Tuất|Đinh Mão', 'Kỷ Tỵ', 'Bính Tý', 'Kỷ Mão', 1994, 10],
    // Nam, năm âm, sinh trước Kinh Trập: vẫn tháng Dần, đại vận nghịch
    [{ gender: 'nam', day: 5, month: 3, year: 2001, hour: 10, minute: 0 }, 'Tân Tỵ|Canh Dần|Đinh Mão|Ất Tỵ', 'Tân Tỵ', 'Đinh Dậu', 'Kỷ Sửu', 2010, 10],
  ];
  for (const [inp, tru, tn, mc, dv1, namDv, tuoiDv] of mau) {
    const r = lap(inp), ten = `${inp.day}/${inp.month}/${inp.year}`;
    assert.equal(r.tru.map((p) => p.canChi).join('|'), tru, ten);
    assert.equal(r.thaiNguyen.canChi, tn, ten + ' Thai nguyên');
    assert.equal(r.menhCung.canChi, mc, ten + ' Mệnh cung');
    assert.deepEqual([r.daiVan[0].canChi, r.daiVan[0].namBatDau, r.daiVan[0].tuoi], [dv1, namDv, tuoiDv], ten + ' đại vận');
  }
  const r = lap(mau[0][0]);
  assert.deepEqual(r.tru.map((p) => p.thapThan), ['Tỷ Kiên', 'Thực Thần', 'Nhật Chủ', 'Chính Ấn']);
  assert.deepEqual(r.tru.map((p) => p.truongSinh), ['Trường Sinh', 'Bệnh', 'Bệnh', 'Lâm Quan']);
  const ts = Object.fromEntries(r.thanSat.map((t) => [t.ten, t.chi.join(' ')]));
  assert.deepEqual(ts, { 'Thiên Ất Quý Nhân': 'Sửu Mùi', 'Văn Xương': 'Thân', 'Lộc Thần': 'Tỵ', 'Dương Nhận': 'Ngọ', 'Đào Hoa': 'Dậu', 'Dịch Mã': 'Dần', 'Hoa Cái': 'Thìn', 'Không Vong': 'Dần Mão' });
  // Lập Xuân 1985 lúc 04:12–04:13 giờ Việt Nam: 4 giờ sáng vẫn là năm Giáp Tý, tháng Đinh Sửu
  const truoc = lap({ gender: 'nu', day: 4, month: 2, year: 1985, hour: 4, minute: 0 });
  assert.equal(truoc.tru[0].canChi + '|' + truoc.tru[1].canChi, 'Giáp Tý|Đinh Sửu');
  // Không rõ giờ: ba trụ, không có Mệnh cung
  const kg = lap({ ...mau[0][0], noHour: true });
  assert.equal(kg.tru[3], null); assert.equal(kg.menhCung, null);
  assert.equal(kg.tru.slice(0, 3).map((p) => p.canChi).join('|'), 'Mậu Dần|Canh Thân|Mậu Thân');
});

test('Bát Tự: lá số ngẫu nhiên đủ dữ liệu, đại vận nối tiếp, nội dung không phán tuyệt đối', () => {
  const BT = require('../src/battu.js');
  const CAM = /chắc chắn sẽ|nhất định sẽ|tuyệt mệnh|chết|yểu|ung thư|tai họa lớn|không thể tránh/i;
  [...BT.NHAT_CHU, ...Object.values(BT.THAP_THAN).flat(), ...Object.values(BT.THAN_SAT_Y), ...Object.values(BT.THAN_SAT_KHUYEN), ...Object.values(BT.HANH_BO), ...Object.values(BT.MANH_Y)]
    .forEach((t) => assert.ok(!CAM.test(t), `Có từ phán tuyệt đối: ${t}`));
  let s = 7;
  const rnd = (k) => { s = (s * 1103515245 + 12345) % 2147483648; return s % k; };
  for (let i = 0; i < 300; i++) {
    const r = BT.compute({ gender: rnd(2) ? 'nam' : 'nu', calendar: 'duong', day: 1 + rnd(28), month: 1 + rnd(12), year: 1920 + rnd(100), hour: rnd(24), minute: rnd(60), namXem: 2026 });
    assert.equal(r.tru.length, 4);
    assert.ok(r.khoiVan.tuoi >= 1 && r.khoiVan.tuoi <= 12, `Tuổi khởi vận ${r.khoiVan.tuoi}`);
    r.daiVan.forEach((v, k) => { if (k) assert.equal(v.namBatDau - r.daiVan[k - 1].namBatDau, 10); });
    r.tru.forEach((p) => { assert.ok(BT.THAP_THAN[p.thapThan] || p.thapThan === 'Nhật Chủ'); p.tangCan.forEach((t) => assert.ok(BT.THAP_THAN[t.thapThan] || t.thapThan === 'Tỷ Kiên')); });
    assert.ok(Math.abs(Object.values(r.nguHanh.diem).reduce((a, b) => a + b, 0) - 8) < 0.05);
  }
});

test('Bát Tự: hồ sơ 10 nhật chủ, biểu tượng, Trường Sinh đủ và không phán tuyệt đối', () => {
  const BT = require('../src/battu.js');
  const C = require('../src/content.js');
  const CAM = /chắc chắn sẽ|nhất định sẽ|tuyệt mệnh|chết|yểu|ung thư|tai họa lớn|không thể tránh/i;
  assert.equal(BT.HO_SO.length, 10); assert.equal(BT.HINH_CAN.length, 10); assert.equal(BT.HINH_CHI.length, 12); assert.equal(BT.CON_GIAP[3], 'Mèo');
  BT.HO_SO.forEach((h, i) => {
    assert.ok(h.moTa.length >= 120 && h.tot.length >= 4 && h.xau.length >= 3, `Hồ sơ can ${i} thiếu`);
    [h.moTa, ...h.tot, ...h.xau].forEach((t) => assert.ok(!CAM.test(t), `Có từ phán tuyệt đối: ${t}`));
  });
  assert.equal(Object.keys(BT.TRUONG_SINH_Y).length, 12);
  Object.values(BT.TRUONG_SINH_Y).forEach((t) => assert.ok(!CAM.test(t), t));
  ['btNhatChu', 'btThapThan', 'btTangCan', 'btTruongSinh', 'btNapAm', 'btThanSat', 'btThai', 'btTiet', 'btDaiVan', 'btNguHanh', 'btManh', 'btLuuNien'].forEach((k) => assert.ok(C.INFO[k], `Thiếu nút (i) ${k}`));
  assert.deepEqual(['Mộc', 'Thủy', 'Hỏa', 'Kim', 'Thổ'].map((x) => BT.nhomTT('Mộc', x)), ['Tỷ Kiếp', 'Ấn', 'Thực Thương', 'Quan Sát', 'Tài']);
});

test('Góp ý: worker lưu, thống kê, chặn bẫy, giới hạn gửi, duyệt trước', async () => {
  const { default: w } = await import('../worker/gop-y.mjs');
  const { d1Local } = await import('../scripts/d1-local.mjs');
  const env = { DB: d1Local(), SALT: 'kiem-thu' };
  const gui = (body, ip = '1.1.1.1', e = env) => w.fetch(new Request('https://x/', { method: 'POST', headers: { 'content-type': 'application/json', 'CF-Connecting-IP': ip }, body: JSON.stringify(body) }), e);
  const lay = async (q = '') => (await w.fetch(new Request('https://x/' + q), env)).json();

  assert.equal((await gui({ ten: 'Lan', sao: 5, noiDung: 'Trang <b>đẹp</b> lắm' })).status, 200);
  assert.equal((await gui({ ten: 'Hùng', sao: 3, noiDung: 'Ổn' }, '2.2.2.2')).status, 400);          // quá ngắn
  assert.equal((await gui({ ten: 'Hùng', sao: 6, noiDung: 'Được đấy' }, '2.2.2.2')).status, 400);     // sao sai
  assert.equal((await gui({ ten: '', sao: 4, noiDung: 'Được đấy' }, '2.2.2.2')).status, 400);          // thiếu tên
  assert.equal((await gui({ ten: 'Bot', sao: 5, noiDung: 'spam spam', web: 'x' }, '3.3.3.3')).status, 200); // bẫy: giả thành công nhưng không lưu
  assert.equal((await gui({ ten: 'Hùng', sao: 3, noiDung: 'Được đấy, cần thêm Bát Tự' }, '2.2.2.2')).status, 200);
  const d = await lay();
  assert.equal(d.tong, 2); assert.equal(d.trungBinh, 4); assert.deepEqual(d.dem, { 1: 0, 2: 0, 3: 1, 4: 0, 5: 1 });
  assert.deepEqual(d.items.map((x) => x.ten), ['Hùng', 'Lan']);            // mới nhất trước
  assert.equal(d.items[1].noiDung, 'Trang <b>đẹp</b> lắm');                // lưu nguyên văn, trang tự escape khi hiện
  // Giới hạn 3 lần / 10 phút mỗi IP
  for (let i = 0; i < 2; i++) assert.equal((await gui({ ten: 'Lan', sao: 4, noiDung: 'Góp ý số ' + i })).status, 200);
  assert.equal((await gui({ ten: 'Lan', sao: 4, noiDung: 'Góp ý thứ tư' })).status, 429);
  // Phân trang 20 một lần
  for (let i = 0; i < 25; i++) await gui({ ten: 'Người ' + i, sao: 1 + (i % 5), noiDung: 'Nội dung ' + i }, '9.9.9.' + i);
  const p1 = await lay(), p2 = await lay('?truoc=' + p1.items[19].id);
  assert.equal(p1.items.length, 20); assert.ok(p1.conNua); assert.equal(p2.items.length, 9); assert.ok(!p2.conNua);
  // Duyệt trước: góp ý mới không hiện
  const env2 = { DB: d1Local(), SALT: 's', DUYET_TRUOC: '1' };
  const r = await (await gui({ ten: 'Mai', sao: 5, noiDung: 'Chờ duyệt nhé' }, '4.4.4.4', env2)).json();
  assert.ok(r.choDuyet);
  assert.equal((await (await w.fetch(new Request('https://x/'), env2)).json()).tong, 0);
  // Chặn nguồn lạ khi đã đặt ALLOWED_ORIGINS
  const env3 = { ...env, ALLOWED_ORIGINS: 'https://a.github.io' };
  assert.equal((await w.fetch(new Request('https://x/', { headers: { Origin: 'https://xau.com' } }), env3)).status, 403);
  assert.equal((await w.fetch(new Request('https://x/', { headers: { Origin: 'https://a.github.io' } }), env3)).status, 200);
});

test('Bản đồ sao: khớp lá mẫu tính bằng Swiss Ephemeris (1/1/1998 14:30 GMT+7, Đồng Văn)', () => {
  const B = require('../src/bandosao.js');
  const r = B.compute({ day: 1, month: 1, year: 1998, hour: 14, minute: 30, clockTz: 7, viDo: 23.13, kinhDo: 105.149 });
  const chuan = { sun: 280.676, moon: 314.396, mercury: 258.664, venus: 303.330, mars: 311.012, jupiter: 322.313, saturn: 13.765, uranus: 307.136, neptune: 298.954, pluto: 246.775, node: 162.312 };
  const lech = (a, b) => Math.abs((((a - b) % 360) + 540) % 360 - 180) * 60; // phút cung
  r.sao.forEach((s) => assert.ok(lech(s.lam, chuan[s.key]) < 2, `${s.ten} lệch ${lech(s.lam, chuan[s.key]).toFixed(1)}'`));
  assert.ok(lech(r.moc.lam, 59.574) < 1 && lech(r.dinh.lam, 315.943) < 1, 'Điểm Mọc / Thiên Đỉnh lệch');
  const nha = Object.fromEntries(r.sao.map((s) => [s.key, s.nha]));
  assert.deepEqual([nha.sun, nha.venus, nha.uranus, nha.jupiter], [8, 9, 9, 10]);
  assert.deepEqual(r.sao.filter((s) => s.nghich).map((s) => s.key), ['venus', 'node']);
  assert.deepEqual(Object.fromEntries(r.sao.filter((s) => s.pham).map((s) => [s.key, s.pham])), { mercury: 'Hãm địa', saturn: 'Tuyệt địa', uranus: 'Đắc địa', neptune: 'Tuyệt địa' });
  assert.equal(r.chuTinhMoc, 'venus');
  // 12 đỉnh nhà theo đúng thứ tự vòng hoàng đạo
  for (let i = 0; i < 12; i++) { const d = (((r.nhaDinh[(i + 1) % 12].lam - r.nhaDinh[i].lam) % 360) + 360) % 360; assert.ok(d > 10 && d < 60, `Nhà ${i + 1} rộng ${d.toFixed(1)}°`); }
});

test('Bản đồ sao: 63 tỉnh thành, không rõ giờ, Nam bán cầu, nội dung không phán tuyệt đối', () => {
  const B = require('../src/bandosao.js');
  const N = require('../src/bandosao-nghia.js');
  assert.equal(B.NOI.length, 63);
  assert.equal(new Set(B.NOI.map((n) => n[0])).size, 63);
  B.NOI.forEach(([, ten, lat, lon]) => assert.ok(lat > 8 && lat < 23.5 && lon > 102 && lon < 110, `Tọa độ lạ: ${ten}`));
  const kg = B.compute({ day: 12, month: 5, year: 1990, noHour: true, clockTz: 7, viDo: 10.78, kinhDo: 106.7 });
  assert.equal(kg.moc, null); assert.equal(kg.nhaDinh, null); assert.ok(kg.sao.every((s) => s.nha === null));
  const uc = B.compute({ day: 4, month: 2, year: 1985, hour: 6, minute: 0, clockTz: 11, viDo: -33.87, kinhDo: 151.21 });
  assert.equal(uc.nhaDinh.length, 12);
  for (let i = 0; i < 12; i++) { const d = (((uc.nhaDinh[(i + 1) % 12].lam - uc.nhaDinh[i].lam) % 360) + 360) % 360; assert.ok(d > 5 && d < 70); }
  const CAM = /chắc chắn sẽ|nhất định sẽ|tuyệt mệnh|chết|yểu|ung thư|tai họa lớn|không thể tránh/i;
  assert.equal(N.CUNG.length, 12); assert.equal(N.NHA.length, 12);
  const tat = [...N.CUNG.flatMap((c) => [c.tuKhoa, c.mt, c.tr, c.moc, ...c.manh, ...c.yeu]), ...Object.values(N.SAO).flat(), ...N.NHA.flat(), ...Object.values(N.GOC).flat(), ...Object.values(N.PHAM).flat(), ...Object.values(N.NGUYEN_TO).flat(), ...Object.values(N.THE)];
  tat.forEach((t) => assert.ok(!CAM.test(t), `Có từ phán tuyệt đối: ${t}`));
  B.SAO.forEach(([k]) => assert.ok(N.SAO[k], `Thiếu nghĩa ${k}`));
  B.PHAM_TEN.forEach((p) => assert.ok(N.PHAM[p]));
});
