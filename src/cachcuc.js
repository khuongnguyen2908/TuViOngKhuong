// Nhận diện cách cục trên lá số gốc (chỉ xét cung Mệnh). Chạy được trong Node như engine.js.
// Tên và điều kiện tham khảo danh sách cách cục của TuViMCP (Apache-2.0) và sách phái Việt; lời giải nghĩa tự biên soạn.
// Mỗi luật: test(c) trả về false, hoặc danh sách sao làm căn cứ (cùng các cung chứa chúng được tô sáng).
const TuViCachCuc = (() => {
  const mod = (n) => ((n % 12) + 12) % 12;
  const CHI = { 'Tý': 0, 'Sửu': 1, 'Dần': 2, 'Mão': 3, 'Thìn': 4, 'Tỵ': 5, 'Ngọ': 6, 'Mùi': 7, 'Thân': 8, 'Dậu': 9, 'Tuất': 10, 'Hợi': 11 };
  const TU_SAT = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'];
  const KHONG_KIEP = ['Địa Không', 'Địa Kiếp'];
  const LUC_SAT = [...TU_SAT, ...KHONG_KIEP];
  const PHA = [...LUC_SAT, 'Hóa Kỵ'];
  const BA_HOA = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'];

  // Công cụ tra lá số cho các luật. m = chi cung Mệnh.
  function context(chart) {
    const P = chart.palaces, m = chart.thienBan.menhCung;
    const at = {};
    P.forEach((pl) => pl.stars.forEach((s) => { at[s.name] = pl.chi; }));
    const o = (p, n) => at[n] === mod(p); // sao n ở cung p
    const TP = [m, mod(m + 4), mod(m + 8), mod(m + 6)]; // tam phương tứ chính
    const trong = (ps, n) => at[n] !== undefined && ps.map(mod).includes(at[n]);
    const chinhO = (p) => P[mod(p)].stars.filter((s) => s.kind === 'chinh').map((s) => s.name);
    const vcd = !chinhO(m).length;
    const c = {
      P, m, at, o, TP, trong, vcd, chinhO,
      xung: mod(m + 6), hop: mod(13 - m), dien: mod(m + 3),
      // Chính tinh "của Mệnh": vô chính diệu thì mượn cung xung chiếu
      menhChinh: vcd ? chinhO(m + 6) : chinhO(m),
      chiMenh: (...ten) => ten.some((t) => CHI[t] === m),
      // sao n ở Mệnh, Mệnh đóng tại một trong các chi
      tai: (n, ...ten) => o(m, n) && ten.some((t) => CHI[t] === m),
      // hai cung giáp Mệnh có cặp a, b (mỗi bên một sao)
      giap: (a, b) => (o(m - 1, a) && o(m + 1, b)) || (o(m - 1, b) && o(m + 1, a)),
      // sao ở Mệnh trong danh sách
      oMenh: (list) => list.filter((n) => o(m, n)),
      // các sao trong danh sách có mặt ở các cung ps
      co: (ps, list) => list.filter((n) => trong(ps, n)),
      sang: (p, n) => { const s = P[mod(p)].stars.find((x) => x.name === n); return s ? s.bright : null; },
    };
    return c;
  }

  // ---------- A. Bộ chính tinh (khung lá số) ----------
  const KHUNG = [
    { id: 'tuPhuVuTuong', ten: 'Tử Phủ Vũ Tướng', bo: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'], min: 3,
      nghia: 'Khung sao của người thích sự vững vàng, có tổ chức; hợp làm quản lý, nhà nước, tài chính. Tiến chậm mà chắc, coi trọng thể diện và trách nhiệm.' },
    { id: 'satPhaTham', ten: 'Sát Phá Liêm Tham', bo: ['Thất Sát', 'Phá Quân', 'Liêm Trinh', 'Tham Lang'],
      nghia: 'Khung sao của người hành động, dám đổi mới, chịu được biến động. Đời nhiều thăng trầm, thành bại thường đến nhanh; hợp kinh doanh, kỹ thuật, nghề cần quyết đoán.' },
    { id: 'coNguyetDongLuong', ten: 'Cơ Nguyệt Đồng Lương', bo: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'],
      nghia: 'Khung sao của người mềm mỏng, tính toán kỹ, hợp công việc ổn định có lương (văn phòng, giáo dục, y tế, kế hoạch). Ít bộc phát, sống bền nhờ cẩn trọng.' },
    { id: 'cuNhat', ten: 'Cự Nhật', bo: ['Cự Môn', 'Thái Dương'],
      nghia: 'Khung sao của người sống bằng lời nói và hiểu biết: dạy học, luật, truyền thông, buôn bán giao tiếp. Thái Dương sáng thì danh tiếng rộng, tối thì dễ thị phi.' },
  ];
  // Xếp theo chính tinh của Mệnh; Mệnh có sao thuộc hai bộ (ví dụ Tử Tham, Cự Cơ) thì hiện cả hai bộ.
  // Căn cứ = các sao của bộ có mặt trong tam phương tứ chính.
  const khung = (c) => KHUNG.filter((k) => c.menhChinh.some((n) => k.bo.includes(n)))
    .map((k) => ({ id: k.id, ten: k.ten, nhom: 'khung', nghia: k.nghia, sao: [...new Set([...c.menhChinh.filter((n) => k.bo.includes(n)), ...c.co(c.TP, k.bo)])] }));

  // ---------- B, C, D. Các cách ----------
  // nhom: cat | hung | bien. che: id các cách nhỏ bị cách này che đi. chuaChac: điểm các trang / sách còn nói khác.
  const RULES = [
    // B. Chính tinh đắc cách tại Mệnh
    { id: 'tuPhuDongCung', ten: 'Tử Phủ đồng cung', nhom: 'cat',
      nghia: 'Hai sao đế tinh cùng đóng Mệnh: người đĩnh đạc, có uy, giỏi giữ của; cần tránh bảo thủ và tự cao.',
      test: (c) => c.o(c.m, 'Tử Vi') && c.o(c.m, 'Thiên Phủ') && ['Tử Vi', 'Thiên Phủ'] },
    { id: 'cucHuongLyMinh', ten: 'Cực hướng Ly minh', nhom: 'cat',
      nghia: 'Tử Vi ở Ngọ là chỗ sáng nhất, không bị sát tinh quấy: chủ người có tầm, dễ được trọng dụng và giữ vị trí cao.',
      test: (c) => c.tai('Tử Vi', 'Ngọ') && !c.oMenh(TU_SAT).length && ['Tử Vi'] },
    { id: 'quanThanKhanhHoi', ten: 'Quân thần khánh hội', nhom: 'cat',
      nghia: 'Tử Vi ở Mệnh có nhiều sao phụ tá hội về: được người giúp, làm việc lớn có thầy có thợ.',
      test: (c) => { const ta = c.co(c.TP, ['Tả Phù', 'Hữu Bật', 'Thiên Khôi', 'Thiên Việt', 'Văn Xương', 'Văn Khúc']); return c.o(c.m, 'Tử Vi') && ta.length >= 3 && ['Tử Vi', ...ta]; } },
    { id: 'phuTuongTrieuVien', ten: 'Phủ Tướng triều viên', nhom: 'cat',
      nghia: 'Thiên Phủ và Thiên Tướng cùng chiếu về Mệnh từ tam hợp: được hưởng sự ổn định, có người nâng đỡ, cơm áo không quá lo.',
      test: (c) => !c.o(c.m, 'Thiên Phủ') && !c.o(c.m, 'Thiên Tướng') && c.trong([c.m + 4, c.m + 8], 'Thiên Phủ') && c.trong([c.m + 4, c.m + 8], 'Thiên Tướng') && ['Thiên Phủ', 'Thiên Tướng'] },
    { id: 'thatSatTrieuDau', ten: 'Thất Sát triều đẩu', nhom: 'cat',
      nghia: 'Thất Sát ở Dần, Thân đối với Tử Phủ: người gan dạ, chủ động, gặp thời thì lập nghiệp lớn; nên học cách kiềm tính nóng.',
      test: (c) => c.tai('Thất Sát', 'Dần', 'Thân') && ['Thất Sát'] },
    { id: 'thatSatNguongDau', ten: 'Thất Sát ngưỡng đẩu', nhom: 'cat',
      chuaChac: 'Có sách gộp Tý, Ngọ chung vào cách Thất Sát triều đẩu.',
      nghia: 'Thất Sát ở Tý, Ngọ: có chí lớn, dám làm; thành công thường đến sau giai đoạn va vấp.',
      test: (c) => c.tai('Thất Sát', 'Tý', 'Ngọ') && ['Thất Sát'] },
    { id: 'anhTinhNhapMieu', ten: 'Anh tinh nhập miếu', nhom: 'cat',
      nghia: 'Phá Quân ở Tý, Ngọ là chỗ miếu địa: người dám phá cũ làm mới, có khí phách; hợp nghề cần mở đường.',
      test: (c) => c.tai('Phá Quân', 'Tý', 'Ngọ') && ['Phá Quân'] },
    { id: 'thachTrungAnNgoc', ten: 'Thạch trung ẩn ngọc', nhom: 'cat',
      chuaChac: 'Có sách đòi thêm Hóa Lộc, Hóa Quyền hoặc Hóa Khoa đi cùng Cự Môn.',
      nghia: 'Cự Môn ở Tý, Ngọ như ngọc trong đá: tài năng lộ muộn, càng mài giũa càng sáng; hợp nghề chuyên môn, nói và viết.',
      test: (c) => c.tai('Cự Môn', 'Tý', 'Ngọ') && ['Cự Môn'] },
    { id: 'kimXanQuangHuy', ten: 'Kim xán quang huy', nhom: 'cat',
      nghia: 'Thái Dương ở Ngọ, mặt trời đứng bóng: người rộng rãi, có tiếng, dễ nổi trước đám đông.',
      test: (c) => c.tai('Thái Dương', 'Ngọ') && ['Thái Dương'] },
    { id: 'nhatChieuLoiMon', ten: 'Nhật chiếu lôi môn', nhom: 'cat',
      nghia: 'Thái Dương ở Mão, mặt trời mới mọc: khởi sắc sớm, có chí tiến thủ, được nhiều người biết đến.',
      test: (c) => c.tai('Thái Dương', 'Mão') && ['Thái Dương'] },
    { id: 'nguyetLangThienMon', ten: 'Nguyệt lãng thiên môn', nhom: 'cat',
      nghia: 'Thái Âm ở Hợi, trăng sáng giữa trời đêm: người thanh nhã, kín đáo, giỏi tích lũy; hợp nghề cần tinh tế.',
      test: (c) => c.tai('Thái Âm', 'Hợi') && ['Thái Âm'] },
    { id: 'nhatNguyetTinhMinh', ten: 'Nhật Nguyệt tịnh minh', nhom: 'cat',
      chuaChac: 'Có trang chỉ xét Nhật ở Tỵ, Nguyệt ở Dậu, không đòi Mệnh ở Sửu.',
      nghia: 'Mệnh ở Sửu, Thái Dương ở Tỵ và Thái Âm ở Dậu đều sáng, cùng chiếu về: học hành, công danh hanh thông.',
      test: (c) => c.chiMenh('Sửu') && c.o(c.m + 4, 'Thái Dương') && c.o(c.m + 8, 'Thái Âm') && ['Thái Dương', 'Thái Âm'] },
    { id: 'minhChauXuatHai', ten: 'Minh châu xuất hải', nhom: 'cat', che: ['menhVoChinhDieu'],
      nghia: 'Mệnh vô chính diệu ở Mùi, có Thái Dương ở Mão và Thái Âm ở Hợi chiếu về như ngọc nổi trên biển: tuy Mệnh trống mà được cả mặt trời lẫn mặt trăng soi, thường có danh.',
      test: (c) => c.vcd && c.chiMenh('Mùi') && c.o(c.m + 8, 'Thái Dương') && c.o(c.m + 4, 'Thái Âm') && ['Thái Dương', 'Thái Âm'] },
    { id: 'nhatNguyetDongLam', ten: 'Nhật Nguyệt đồng lâm', nhom: 'bien',
      nghia: 'Thái Dương và Thái Âm cùng ở Sửu, Mùi: tính hai mặt, lúc cương lúc nhu; khéo dung hòa thì làm được nhiều việc, thiếu chủ kiến thì hay dao động.',
      test: (c) => c.o(c.m, 'Thái Dương') && c.o(c.m, 'Thái Âm') && ['Thái Dương', 'Thái Âm'] },
    { id: 'nhatNguyetChieuBich', ten: 'Nhật Nguyệt chiếu bích', nhom: 'cat',
      nghia: 'Thái Dương và Thái Âm cùng ở cung Điền Trạch: dễ có nhà cửa, đất đai; tài sản cố định là chỗ dựa.',
      test: (c) => c.o(c.dien, 'Thái Dương') && c.o(c.dien, 'Thái Âm') && ['Thái Dương', 'Thái Âm'] },
    { id: 'cuNhatDongCung', ten: 'Cự Nhật đồng cung', nhom: 'cat',
      nghia: 'Cự Môn cùng Thái Dương: có tài ăn nói, dễ có tiếng tăm, hợp giao thiệp với nước ngoài. Ở Dần tốt hơn ở Thân.',
      test: (c) => c.o(c.m, 'Cự Môn') && c.o(c.m, 'Thái Dương') && ['Cự Môn', 'Thái Dương'] },
    { id: 'cuCoDongLam', ten: 'Cự Cơ đồng lâm', nhom: 'cat',
      nghia: 'Cự Môn cùng Thiên Cơ: thông minh, lanh lợi, giỏi phân tích và buôn bán. Ở Mão tốt hơn ở Dậu.',
      test: (c) => c.o(c.m, 'Cự Môn') && c.o(c.m, 'Thiên Cơ') && ['Cự Môn', 'Thiên Cơ'] },
    { id: 'coLuongThinTuat', ten: 'Cơ Lương Thìn Tuất', nhom: 'cat',
      nghia: 'Thiên Cơ cùng Thiên Lương ở Thìn, Tuất: mưu trí, có lòng giúp người; hợp làm cố vấn, giáo dục, y dược.',
      test: (c) => c.o(c.m, 'Thiên Cơ') && c.o(c.m, 'Thiên Lương') && ['Thiên Cơ', 'Thiên Lương'] },
    { id: 'thoTinhNhapMieu', ten: 'Thọ tinh nhập miếu', nhom: 'cat',
      nghia: 'Thiên Lương ở Ngọ là chỗ miếu: người chính trực, được kính trọng, gặp nạn hay có người cứu giải.',
      test: (c) => c.tai('Thiên Lương', 'Ngọ') && ['Thiên Lương'] },
    { id: 'hungTuTrieuVien', ten: 'Hùng tú triều viên', nhom: 'cat',
      chuaChac: 'TuViMCP ghi Liêm Trinh ở Thân, Mùi; sách Trung Hoa ghi Dần, Thân.',
      nghia: 'Liêm Trinh ở Dần, Thân, không bị sát tinh: người có nguyên tắc, làm việc nghiêm, hợp ngành kỷ luật hoặc quản lý.',
      test: (c) => c.tai('Liêm Trinh', 'Dần', 'Thân') && !c.oMenh(TU_SAT).length && ['Liêm Trinh'] },
    { id: 'thamVuDongHanh', ten: 'Tham Vũ đồng hành', nhom: 'cat',
      nghia: 'Tham Lang cùng Vũ Khúc: giỏi kiếm tiền, thường phát muộn (sau 30 tuổi) rồi mới vững.',
      test: (c) => c.o(c.m, 'Tham Lang') && c.o(c.m, 'Vũ Khúc') && ['Tham Lang', 'Vũ Khúc'] },
    { id: 'thamHoaLinh', ten: 'Tham Hỏa, Tham Linh', nhom: 'cat',
      nghia: 'Tham Lang gặp Hỏa Tinh hoặc Linh Tinh: dễ có lúc phát nhanh bất ngờ; cần giữ của khi đang lên.',
      test: (c) => { const hl = c.co([c.m, c.xung], ['Hỏa Tinh', 'Linh Tinh']); return c.o(c.m, 'Tham Lang') && hl.length > 0 && ['Tham Lang', ...hl]; } },

    // C. Phụ tinh và Tứ hóa
    { id: 'tamKyGiaHoi', ten: 'Tam kỳ gia hội', nhom: 'cat', che: ['quyenLocHoiMenh'],
      nghia: 'Đủ ba hóa Lộc, Quyền, Khoa hội về Mệnh: có tiền, có tiếng, có quyền; dễ thành đạt nếu chịu làm.',
      test: (c) => BA_HOA.every((n) => c.trong(c.TP, n)) && BA_HOA },
    { id: 'quyenLocHoiMenh', ten: 'Quyền Lộc hội Mệnh', nhom: 'cat',
      nghia: 'Hóa Lộc và Hóa Quyền cùng hội về Mệnh: vừa có lộc vừa có tiếng nói, làm ăn dễ có chỗ đứng.',
      test: (c) => ['Hóa Lộc', 'Hóa Quyền'].every((n) => c.trong(c.TP, n)) && ['Hóa Lộc', 'Hóa Quyền'] },
    { id: 'khoaQuyenLocGiap', ten: 'Khoa Quyền Lộc giáp', nhom: 'cat',
      nghia: 'Hai cung kề Mệnh mang hai trong ba hóa Lộc, Quyền, Khoa: được người quanh mình nâng đỡ, gặp nhiều dịp tốt.',
      test: (c) => { for (const a of BA_HOA) for (const b of BA_HOA) if (a !== b && c.giap(a, b)) return [a, b]; return false; } },
    { id: 'songLocGiapMenh', ten: 'Song Lộc giáp Mệnh', nhom: 'cat',
      nghia: 'Lộc Tồn và Hóa Lộc kẹp hai bên Mệnh: tiền bạc đến từ người thân, môi trường quanh mình.',
      test: (c) => c.giap('Lộc Tồn', 'Hóa Lộc') && ['Lộc Tồn', 'Hóa Lộc'] },
    { id: 'songLocDongCung', ten: 'Song Lộc đồng cung', nhom: 'cat',
      nghia: 'Lộc Tồn và Hóa Lộc cùng ở Mệnh: tài lộc dồi dào, giỏi giữ tiền; dễ thành người khá giả.',
      test: (c) => c.o(c.m, 'Lộc Tồn') && c.o(c.m, 'Hóa Lộc') && ['Lộc Tồn', 'Hóa Lộc'] },
    { id: 'songLocTrieuVien', ten: 'Song Lộc triều viên', nhom: 'cat',
      nghia: 'Lộc Tồn và Hóa Lộc cùng hội về Mệnh từ tam phương: nhiều nguồn thu, làm ăn có lãi.',
      test: (c) => c.trong(c.TP, 'Lộc Tồn') && c.trong(c.TP, 'Hóa Lộc') && !(c.o(c.m, 'Lộc Tồn') && c.o(c.m, 'Hóa Lộc')) && ['Lộc Tồn', 'Hóa Lộc'] },
    { id: 'locMaGiaoTri', ten: 'Lộc Mã giao trì', nhom: 'cat',
      nghia: 'Thiên Mã đi cùng Lộc ở Mệnh hoặc Thiên Di: tiền đến nhờ đi lại, buôn bán xa, đổi chỗ làm.',
      test: (c) => { for (const p of [c.m, c.xung]) { const loc = c.co([p], ['Lộc Tồn', 'Hóa Lộc']); if (c.o(p, 'Thiên Mã') && loc.length) return ['Thiên Mã', ...loc]; } return false; } },
    { id: 'minhLocAmLoc', ten: 'Minh Lộc ám Lộc', nhom: 'cat',
      nghia: 'Một Lộc ở Mệnh, một Lộc ở cung nhị hợp: ngoài nguồn thu chính còn có lộc ngầm, được giúp đỡ kín đáo.',
      test: (c) => ((c.o(c.m, 'Hóa Lộc') && c.o(c.hop, 'Lộc Tồn')) || (c.o(c.m, 'Lộc Tồn') && c.o(c.hop, 'Hóa Lộc'))) && ['Hóa Lộc', 'Lộc Tồn'] },
    { id: 'xuongKhucHoiMenh', ten: 'Xương Khúc hội Mệnh', nhom: 'cat',
      nghia: 'Văn Xương và Văn Khúc về Mệnh: sáng dạ, học giỏi, có khiếu văn chương nghệ thuật.',
      test: (c) => ((c.o(c.m, 'Văn Xương') && c.o(c.m, 'Văn Khúc')) || (c.chiMenh('Sửu', 'Mùi') && c.trong(c.TP, 'Văn Xương') && c.trong(c.TP, 'Văn Khúc'))) && ['Văn Xương', 'Văn Khúc'] },
    { id: 'taHuuDongCung', ten: 'Tả Hữu đồng cung', nhom: 'cat',
      nghia: 'Tả Phù và Hữu Bật cùng ở Mệnh: được bạn bè, đồng nghiệp hết lòng giúp; hợp làm việc nhóm.',
      test: (c) => c.o(c.m, 'Tả Phù') && c.o(c.m, 'Hữu Bật') && ['Tả Phù', 'Hữu Bật'] },
    { id: 'toaQuyHuongQuy', ten: 'Tọa quý hướng quý', nhom: 'cat',
      nghia: 'Thiên Khôi và Thiên Việt, một ở Mệnh một ở Thiên Di: hay gặp quý nhân, thi cử và xin việc thuận.',
      test: (c) => ((c.o(c.m, 'Thiên Khôi') && c.o(c.xung, 'Thiên Việt')) || (c.o(c.m, 'Thiên Việt') && c.o(c.xung, 'Thiên Khôi'))) && ['Thiên Khôi', 'Thiên Việt'] },
    { id: 'quyTinhGiapMenh', ten: 'Quý tinh giáp Mệnh', nhom: 'cat',
      nghia: 'Hai cung kề Mệnh có một cặp sao quý: được che chở, người xung quanh tốt với mình.',
      test: (c) => { for (const [a, b] of [['Thái Dương', 'Thái Âm'], ['Tả Phù', 'Hữu Bật'], ['Thiên Khôi', 'Thiên Việt'], ['Văn Xương', 'Văn Khúc']]) if (c.giap(a, b)) return [a, b]; return false; } },
    { id: 'vanLuongChanKy', ten: 'Văn Lương chấn kỷ', nhom: 'cat',
      nghia: 'Thiên Lương ở Mệnh gặp Văn Xương: người có học, ngay thẳng, hợp ngành giáo dục, luật, công vụ.',
      test: (c) => c.o(c.m, 'Thiên Lương') && c.trong(c.TP, 'Văn Xương') && ['Thiên Lương', 'Văn Xương'] },
    { id: 'duongLuongXuongLoc', ten: 'Dương Lương Xương Lộc', nhom: 'cat',
      nghia: 'Thái Dương, Thiên Lương, Văn Xương và Lộc cùng hội: thi cử đỗ đạt, công danh nhờ học vấn.',
      test: (c) => { const loc = c.co(c.TP, ['Lộc Tồn', 'Hóa Lộc']); return ['Thái Dương', 'Thiên Lương', 'Văn Xương'].every((n) => c.trong(c.TP, n)) && loc.length > 0 && ['Thái Dương', 'Thiên Lương', 'Văn Xương', ...loc]; } },

    // D. Hung cách, phá cách
    { id: 'kinhDaGiapMenh', ten: 'Kình Đà giáp Mệnh', nhom: 'hung',
      nghia: 'Kình Dương và Đà La kẹp hai bên Mệnh (Lộc Tồn ở Mệnh): có của mà hay bị bó buộc, dễ vướng thị phi; nên giữ mình, ít tranh chấp.',
      test: (c) => c.giap('Kình Dương', 'Đà La') && ['Kình Dương', 'Đà La'] },
    { id: 'khongKiepGiapMenh', ten: 'Không Kiếp giáp Mệnh', nhom: 'hung',
      nghia: 'Địa Không và Địa Kiếp kẹp hai bên Mệnh: tiền đến rồi đi, kế hoạch hay bị cản; nên làm chắc, tránh đầu cơ.',
      test: (c) => c.giap('Địa Không', 'Địa Kiếp') && ['Địa Không', 'Địa Kiếp'] },
    { id: 'hoaLinhGiapMenh', ten: 'Hỏa Linh giáp Mệnh', nhom: 'hung',
      nghia: 'Hỏa Tinh và Linh Tinh kẹp hai bên Mệnh: tính nóng, dễ gặp chuyện gấp gáp; cần bình tĩnh trước khi quyết.',
      test: (c) => c.giap('Hỏa Tinh', 'Linh Tinh') && ['Hỏa Tinh', 'Linh Tinh'] },
    { id: 'menhVoChinhDieu', ten: 'Mệnh vô chính diệu', nhom: 'bien',
      nghia: 'Mệnh không có chính tinh, mượn sao cung xung chiếu: linh hoạt, dễ thích nghi, chịu ảnh hưởng nhiều từ hoàn cảnh và người bên cạnh.',
      test: (c) => c.vcd && [] },
    { id: 'vcdTamKhong', ten: 'Vô chính diệu đắc tam không', nhom: 'cat',
      chuaChac: 'Sách nói khác nhau về việc cần những "không" nào (Tuần, Triệt, Địa Không, Thiên Không) và cần mấy cái.',
      nghia: 'Mệnh trống lại gặp các sao "không": trống đón trống thành ra thoáng, người có tầm nhìn riêng, có khi nổi bật bất ngờ.',
      test: (c) => {
        if (!c.vcd) return false;
        const ps = [c.m, c.xung];
        const k = [...c.co(ps, ['Địa Không', 'Thiên Không']), ...(ps.some((p) => c.P[p].tuan) ? ['Tuần'] : []), ...(ps.some((p) => c.P[p].triet) ? ['Triệt'] : [])];
        return k.length >= 2 && k;
      } },
    { id: 'khongKiepThuMenh', ten: 'Không Kiếp thủ Mệnh', nhom: 'hung',
      nghia: 'Địa Không hoặc Địa Kiếp đóng Mệnh: suy nghĩ khác người, đời có lúc trắng tay rồi gây dựng lại; hợp nghề sáng tạo, tránh đánh bạc và đầu cơ.',
      test: (c) => { const k = c.oMenh(KHONG_KIEP); return k.length > 0 && k; } },
    { id: 'maDauDoiKiem', ten: 'Mã đầu đới kiếm', nhom: 'bien',
      nghia: 'Kình Dương ở Ngọ: gian nan, va chạm lúc đầu rồi mới nổi; có uy và sức chịu đựng, nên cẩn thận tai nạn, dao kéo.',
      test: (c) => c.tai('Kình Dương', 'Ngọ') && ['Kình Dương'] },
    { id: 'cuPhungTuSat', ten: 'Cự phùng tứ sát', nhom: 'hung',
      nghia: 'Cự Môn đóng Mệnh gặp sát tinh: dễ bị hiểu lầm, khẩu thiệt, kiện tụng; nói ít làm nhiều thì đỡ.',
      test: (c) => { const s = c.oMenh(TU_SAT); return c.o(c.m, 'Cự Môn') && s.length > 0 && ['Cự Môn', ...s]; } },
    { id: 'linhXuongDaVu', ten: 'Linh Xương Đà Vũ', nhom: 'hung',
      nghia: 'Linh Tinh, Văn Xương, Đà La, Vũ Khúc cùng hội: dễ gặp chuyện bất ngờ về tiền bạc, giấy tờ; nên làm việc có hợp đồng rõ ràng.',
      test: (c) => { const l = ['Linh Tinh', 'Văn Xương', 'Đà La', 'Vũ Khúc']; return l.every((n) => c.trong(c.TP, n)) && l; } },
    { id: 'locPhungXungPha', ten: 'Lộc phùng xung phá', nhom: 'hung',
      nghia: 'Lộc ở Mệnh mà gặp Địa Không, Địa Kiếp: có tiền nhưng khó giữ, dễ hao vì người khác; nên để dành và tránh cho vay.',
      test: (c) => { const loc = c.oMenh(['Lộc Tồn', 'Hóa Lộc']); const k = c.co([c.m, c.xung], KHONG_KIEP); return loc.length > 0 && k.length > 0 && [...loc, ...k]; } },
    { id: 'hinhTuGiapAn', ten: 'Hình Tù giáp Ấn', nhom: 'hung',
      nghia: 'Liêm Trinh, Thiên Tướng gặp Kình Dương cùng cung: dễ vướng giấy tờ, pháp lý; làm đúng luật là cách giải.',
      test: (c) => c.o(c.m, 'Liêm Trinh') && c.o(c.m, 'Thiên Tướng') && c.o(c.m, 'Kình Dương') && ['Liêm Trinh', 'Thiên Tướng', 'Kình Dương'] },
    { id: 'nhatNguyetPhanBoi', ten: 'Nhật Nguyệt phản bối', nhom: 'hung',
      nghia: 'Thái Dương và Thái Âm đều hãm trong tam phương: vất vả hơn người, ít được nhờ cha mẹ; tự lực thì vẫn khá.',
      test: (c) => c.trong(c.TP, 'Thái Dương') && c.trong(c.TP, 'Thái Âm') && c.sang(c.at['Thái Dương'], 'Thái Dương') === 'H' && c.sang(c.at['Thái Âm'], 'Thái Âm') === 'H' && ['Thái Dương', 'Thái Âm'] },
    // Thêm 30/10 để cát hung cân hơn (trước đó mỗi lá số trung bình 1,05 cách cát, 0,48 cách hung)
    { id: 'kyThuMenh', ten: 'Kỵ thủ Mệnh', nhom: 'hung',
      nghia: 'Hóa Kỵ đóng Mệnh: hay vướng mắc trong lòng, dễ bị hiểu lầm, việc mình làm thường gặp trở ngại hoặc bị soi xét hơn người khác. Thành công đến chậm và tốn sức hơn.',
      test: (c) => c.o(c.m, 'Hóa Kỵ') && ['Hóa Kỵ'] },
    { id: 'kinhDaHamThuMenh', ten: 'Kình Đà hãm thủ Mệnh', nhom: 'hung',
      nghia: 'Kình Dương hoặc Đà La ở thế hãm đóng Mệnh: tính cứng, dễ va chạm, đời nhiều trắc trở và thị phi; hay gặp chuyện kéo dài khó dứt.',
      test: (c) => { const k = ['Kình Dương', 'Đà La'].filter((n) => c.o(c.m, n) && c.sang(c.m, n) === 'H'); return k.length > 0 && k; } },
    { id: 'hoaLinhHamThuMenh', ten: 'Hỏa Linh hãm thủ Mệnh', nhom: 'hung',
      nghia: 'Hỏa Tinh hoặc Linh Tinh ở thế hãm đóng Mệnh: nóng nảy, bất an, dễ gặp chuyện bất ngờ gây thiệt hại; quyết định vội thường phải trả giá.',
      test: (c) => { const k = ['Hỏa Tinh', 'Linh Tinh'].filter((n) => c.o(c.m, n) && c.sang(c.m, n) === 'H'); return k.length > 0 && k; } },
    { id: 'satTinhHoiMenh', ten: 'Sát tinh hội Mệnh', nhom: 'hung',
      nghia: 'Từ 4 sát tinh trở lên hội về Mệnh và tam phương: đời nhiều sóng gió, cạnh tranh, mất mát; cái tốt của chính tinh bị giảm đáng kể.',
      test: (c) => { const s = c.co(c.TP, LUC_SAT); return s.length >= 4 && s; } },
    { id: 'tuanTrietDuongDau', ten: 'Tuần Triệt đương đầu', nhom: 'hung',
      nghia: 'Tuần và Triệt cùng đóng Mệnh: thời trẻ nhiều cản trở, công sức bỏ ra hay bị chặn giữa chừng; thường phải qua tuổi trung niên mới ổn.',
      test: (c) => c.P[c.m].tuan && c.P[c.m].triet && [] },
    { id: 'hinhSatThuMenh', ten: 'Hình sát thủ Mệnh', nhom: 'hung',
      nghia: 'Thiên Hình gặp Kình Dương hoặc Đà La cùng đóng Mệnh: dễ vướng tai nạn, thương tích hoặc chuyện pháp lý; tính khắc nghiệt dễ gây xung đột.',
      test: (c) => { const k = ['Kình Dương', 'Đà La'].filter((n) => c.o(c.m, n)); return c.o(c.m, 'Thiên Hình') && k.length > 0 && ['Thiên Hình', ...k]; } },
  ];

  // Căn cứ: gom sao theo cung, ví dụ "Mệnh (Tý): Thái Dương; Thiên Di (Ngọ): Cự Môn"
  function canCu(c, sao) {
    const by = new Map();
    sao.forEach((n) => { const p = c.at[n]; if (p === undefined) return; if (!by.has(p)) by.set(p, []); if (!by.get(p).includes(n)) by.get(p).push(n); });
    return [...by.entries()].sort((a, b) => mod(a[0] - c.m) - mod(b[0] - c.m)).map(([p, ns]) => `${c.P[p].cung} (${c.P[p].chiTen}): ${ns.join(', ')}`).join('; ');
  }

  // Trả về { khung: [...], cach: [...] }; mỗi mục có id, ten, nhom, nghia, canCu, cung (chi cần tô sáng), pha, chuaChac.
  function detect(chart) {
    const c = context(chart);
    const full = (r, sao) => {
      const ext = [];
      if (r.id === 'vcdTamKhong') sao = sao.filter((n) => n !== 'Tuần' && n !== 'Triệt'); // Tuần, Triệt không phải sao trong cung
      const cung = [...new Set([c.m, ...sao.map((n) => c.at[n]).filter((p) => p !== undefined)])];
      if (r.id === 'menhVoChinhDieu' || r.id === 'vcdTamKhong') { cung.push(c.xung); ext.push(`Mệnh (${c.P[c.m].chiTen}) vô chính diệu, mượn ${c.P[c.xung].cung} (${c.P[c.xung].chiTen}): ${c.chinhO(c.xung).join(', ')}`); }
      if (r.id === 'tuanTrietDuongDau') ext.push(`Tuần và Triệt cùng ở Mệnh (${c.P[c.m].chiTen})`);
      if (r.id === 'vcdTamKhong') [c.m, c.xung].forEach((p) => { if (c.P[p].tuan) ext.push(`Tuần ở ${c.P[p].cung}`); if (c.P[p].triet) ext.push(`Triệt ở ${c.P[p].cung}`); });
      // Phá cách: cách cát mà Mệnh có sát tinh / Hóa Kỵ (trừ sao đã là căn cứ của chính cách đó)
      const pha = r.nhom === 'cat' ? c.oMenh(PHA).filter((n) => !sao.includes(n)) : [];
      return { id: r.id, ten: r.ten, nhom: r.nhom, nghia: r.nghia, canCu: [...ext, canCu(c, sao)].filter(Boolean).join('; '), cung, pha, chuaChac: r.chuaChac || null };
    };
    const hit = [];
    RULES.forEach((r) => { const sao = r.test(c); if (sao) hit.push(full(r, sao)); });
    const bi = new Set(hit.flatMap((h) => RULES.find((r) => r.id === h.id).che || []));
    const k = khung(c).map((x) => ({ ...x, canCu: canCu(c, x.sao), cung: [...new Set([c.m, ...x.sao.map((n) => c.at[n])])], pha: [], chuaChac: null }));
    k.forEach((x) => delete x.sao);
    return { khung: k, cach: hit.filter((h) => !bi.has(h.id)) };
  }

  return { detect, RULES, KHUNG };
})();

if (typeof module !== 'undefined') module.exports = TuViCachCuc;
