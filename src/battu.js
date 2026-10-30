// Bát Tự (Tứ Trụ): trụ năm đổi ở Lập Xuân, trụ tháng theo 12 tiết, tính theo thời điểm Mặt Trời qua kinh độ tiết.
// Chạy được trong Node như engine.js. Lời giải nghĩa tự biên soạn, mang tính tham khảo.
const TuViBatTu = (() => {
  const L = (typeof LunarVN !== 'undefined') ? LunarVN : require('./lunar.js');
  const E = (typeof TuViEngine !== 'undefined') ? TuViEngine : require('./engine.js');
  const { CAN, CHI } = L;
  const mod = (n, m = 12) => ((n % m) + m) % m;
  const CAN_HANH = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
  const CHI_HANH = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
  const HANH = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
  const SINH = { Kim: 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  const KHAC = { Kim: 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };
  const ME = Object.fromEntries(Object.entries(SINH).map(([a, b]) => [b, a])); // hành sinh ra hành này
  const KHAC_TA = Object.fromEntries(Object.entries(KHAC).map(([a, b]) => [b, a])); // hành khắc hành này
  // Tàng can trong địa chi: bản khí, trung khí, dư khí
  const TANG_CAN = [[9], [5, 9, 7], [0, 2, 4], [1], [4, 1, 9], [2, 6, 4], [3, 5], [5, 3, 1], [6, 8, 4], [7], [4, 7, 3], [8, 0]];
  const TANG_W = { 1: [1], 2: [0.7, 0.3], 3: [0.6, 0.3, 0.1] };
  const TRUONG_SINH = ['Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
  const TS_GOC = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3]; // chi Trường Sinh của 10 can; can dương đi thuận, can âm đi nghịch
  const TIET = ['Lập xuân', 'Kinh trập', 'Thanh minh', 'Lập hạ', 'Mang chủng', 'Tiểu thử', 'Lập thu', 'Bạch lộ', 'Hàn lộ', 'Lập đông', 'Đại tuyết', 'Tiểu hàn'];
  const TRU = ['Năm', 'Tháng', 'Ngày', 'Giờ'];

  function thapThan(nhat, can) {
    const a = CAN_HANH[nhat], b = CAN_HANH[can], cung = nhat % 2 === can % 2;
    if (a === b) return cung ? 'Tỷ Kiên' : 'Kiếp Tài';
    if (SINH[a] === b) return cung ? 'Thực Thần' : 'Thương Quan';
    if (KHAC[a] === b) return cung ? 'Thiên Tài' : 'Chính Tài';
    if (KHAC[b] === a) return cung ? 'Thất Sát' : 'Chính Quan';
    return cung ? 'Thiên Ấn' : 'Chính Ấn';
  }
  const truongSinh = (can, chi) => TRUONG_SINH[can % 2 === 0 ? mod(chi - TS_GOC[can]) : mod(TS_GOC[can] - chi)];
  const tenCC = (can, chi) => CAN[can] + ' ' + CHI[chi];
  const amDuong = (i) => (i % 2 === 0 ? '+' : '–');

  // Thời điểm Mặt Trời tới kinh độ t (độ), tìm quanh jd (JD theo UT)
  function tietLuc(t, jd) {
    for (let i = 0; i < 6; i++) jd += (mod(t - L.sunLongitude(jd) + 180, 360) - 180) / 0.98565;
    return jd;
  }
  // JD (UT) → ngày giờ Việt Nam
  function ngayGio(jd) {
    const x = jd + 0.5 + 7 / 24, j = Math.floor(x), mins = Math.round((x - j) * 1440);
    const d = L.fromJdn(j);
    return { ...d, hour: Math.floor(mins / 60) % 24, minute: mins % 60 };
  }

  // Thần sát chính: chi mà sao đóng, tra theo can ngày hoặc chi ngày
  const THAN_SAT = [
    ['Thiên Ất Quý Nhân', 'can', [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [2, 6], [3, 5], [3, 5]]],
    ['Văn Xương', 'can', [5, 6, 8, 9, 8, 9, 11, 0, 2, 3]],
    ['Lộc Thần', 'can', [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]],
    ['Dương Nhận', 'can', [3, 4, 6, 7, 6, 7, 9, 10, 0, 1]],
    ['Đào Hoa', 'chi', { 0: 9, 2: 3, 1: 6, 3: 0 }],
    ['Dịch Mã', 'chi', { 0: 2, 2: 8, 1: 11, 3: 5 }],
    ['Hoa Cái', 'chi', { 0: 4, 2: 10, 1: 1, 3: 7 }],
  ];

  // input như TuViEngine.compute; input.noHour = true khi không rõ giờ (chỉ lập ba trụ)
  function compute(input) {
    const opt = { ...E.DEFAULT_OPTIONS, ...(input.options || {}) };
    const cal = L.makeCalendar(7);
    const male = input.gender !== 'nu';
    let solarJdn;
    if (input.calendar === 'am') {
      const s = cal.lunarToSolar(input.day, input.month, input.year, !!input.leap);
      if (!s) throw new Error('Ngày âm lịch không tồn tại (kiểm tra tháng nhuận hoặc ngày 30).');
      solarJdn = s.jdn;
    } else {
      solarJdn = L.jdn(input.day, input.month, input.year);
      const chk = L.fromJdn(solarJdn);
      if (chk.day !== input.day || chk.month !== input.month) throw new Error('Ngày dương lịch không tồn tại.');
    }
    const noHour = !!input.noHour;
    // Không rõ giờ: lấy giữa trưa để tính trụ năm, tháng, ngày
    let minutes = noHour ? 720 : (input.hour || 0) * 60 + (input.minute || 0) - ((input.clockTz || 7) - 7) * 60;
    while (minutes < 0) { minutes += 1440; solarJdn -= 1; }
    while (minutes >= 1440) { minutes -= 1440; solarJdn += 1; }
    const solar = L.fromJdn(solarJdn);
    const jd = solarJdn - 0.5 + minutes / 1440 - 7 / 24;
    const lam = L.sunLongitude(jd);

    // Trụ năm: đổi ở Lập Xuân (315°); trụ tháng: tháng Dần bắt đầu ở Lập Xuân, mỗi tiết 30°
    const k = Math.floor(mod(lam - 315, 360) / 30);
    const namBT = (solar.month <= 2 && lam >= 270 && lam < 315) ? solar.year - 1 : solar.year;
    const nam = L.yearCanChi(namBT);
    const thangChi = mod(2 + k);
    const danCan = mod((nam.can % 5) * 2 + 2, 10); // ngũ hổ độn: can của tháng Dần
    const thang = { can: mod(danCan + mod(thangChi - 2), 10), chi: thangChi };
    // Trụ ngày, giờ: giờ Tý muộn (23–24 giờ) theo tùy chọn chung, mặc định tính sang ngày sau
    const h = Math.floor((minutes + 60) / 120) % 12;
    const lateTy = minutes >= 23 * 60;
    const dayJdn = (lateTy && opt.gioTy === 'ngaySau') ? solarJdn + 1 : solarJdn;
    const ngay = L.dayCanChi(dayJdn);
    const gio = noHour ? null : L.hourCanChi(ngay.can, h);
    const nc = ngay.can;

    const pillar = (cc, ten) => cc && {
      ten, can: cc.can, chi: cc.chi, canChi: tenCC(cc.can, cc.chi),
      canHanh: CAN_HANH[cc.can], chiHanh: CHI_HANH[cc.chi], canAD: amDuong(cc.can), chiAD: amDuong(cc.chi),
      thapThan: ten === 'Ngày' ? 'Nhật Chủ' : thapThan(nc, cc.can),
      tangCan: TANG_CAN[cc.chi].map((c) => ({ can: c, ten: CAN[c], hanh: CAN_HANH[c], ad: amDuong(c), thapThan: thapThan(nc, c) })),
      truongSinh: truongSinh(nc, cc.chi), napAm: E.napAm(cc.can, cc.chi).ten,
    };
    const tru = [pillar(nam, 'Năm'), pillar(thang, 'Tháng'), pillar(ngay, 'Ngày'), pillar(gio, 'Giờ')];
    const co = tru.filter(Boolean);

    // Thai nguyên: can tháng +1, chi tháng +3. Mệnh cung: tháng tính theo trung khí, chi = 4 – tháng – giờ
    const thaiNguyen = pillar({ can: mod(thang.can + 1, 10), chi: mod(thang.chi + 3) }, 'Thai nguyên');
    let menhCung = null;
    if (!noHour) {
      const tk = mod(2 + Math.floor(mod(lam - 330, 360) / 30));
      const chi = mod(4 - tk - h);
      menhCung = pillar({ can: mod(danCan + chi - 2, 10), chi }, 'Mệnh cung');
    }

    // Ngũ hành: thiên can 1 điểm, địa chi chia theo tàng can
    const diem = Object.fromEntries(HANH.map((x) => [x, 0]));
    const dem = Object.fromEntries(HANH.map((x) => [x, 0]));
    co.forEach((p) => {
      diem[p.canHanh] += 1; dem[p.canHanh] += 1; dem[p.chiHanh] += 1;
      const tc = TANG_CAN[p.chi], w = TANG_W[tc.length];
      tc.forEach((c, i) => { diem[CAN_HANH[c]] += w[i]; });
    });
    Object.keys(diem).forEach((x) => { diem[x] = Math.round(diem[x] * 10) / 10; });
    // Nhật chủ mạnh yếu (ước lượng): phe ta = cùng hành + hành sinh ta (bỏ chính can ngày), cộng thêm nếu được lệnh tháng
    const H = CAN_HANH[nc], ta = [H, ME[H]];
    const tong = co.length * 2 - 1;
    const duocLenh = ta.includes(CAN_HANH[TANG_CAN[thang.chi][0]]);
    const phe = ta.reduce((s, x) => s + diem[x], 0) - 1 + (duocLenh ? 1 : 0);
    const ty = phe / (tong + (duocLenh ? 1 : 0));
    const manh = ty >= 0.55 ? 'vuong' : ty <= 0.42 ? 'nhuoc' : 'hoa';
    // Hành nên bổ sung: yếu thì Ấn, Tỷ; mạnh thì Thực Thương, Tài, Quan; cân bằng thì hai hành ít nhất
    const hy = manh === 'nhuoc' ? [ME[H], H] : manh === 'vuong' ? [SINH[H], KHAC[H], KHAC_TA[H]]
      : [...HANH].sort((a, b) => diem[a] - diem[b]).slice(0, 2);
    const thieu = HANH.filter((x) => dem[x] === 0);

    // Đại vận: năm dương nam / năm âm nữ đi thuận, còn lại đi nghịch; 3 ngày tới tiết = 1 năm
    const thuan = (nam.can % 2 === 0) === male;
    const tGoc = mod(315 + 30 * (k + (thuan ? 1 : 0)), 360);
    const jdTiet = tietLuc(tGoc, jd + (thuan ? 1 : -1) * mod(thuan ? tGoc - lam : lam - tGoc, 360) / 0.98565);
    const ngayToiTiet = Math.abs(jdTiet - jd);
    const khoi = ngayGio(jd + ngayToiTiet * 365.2425 / 3);
    const lunar = cal.solarToLunar(solar.day, solar.month, solar.year);
    const namXem = input.namXem || new Date().getFullYear();
    const tuoiKhoi = khoi.year - lunar.year + 1;
    const daiVan = Array.from({ length: 10 }, (_, i) => {
      const step = (i + 1) * (thuan ? 1 : -1);
      const p = pillar({ can: mod(thang.can + step, 10), chi: mod(thang.chi + step) }, 'Đại vận');
      return { ...p, namBatDau: khoi.year + i * 10, tuoi: tuoiKhoi + i * 10 };
    });
    const dvNay = daiVan.find((v) => namXem >= v.namBatDau && namXem < v.namBatDau + 10) || null;
    const luuNien = (y) => pillar(L.yearCanChi(y), 'Lưu niên');

    // Thần sát: chi đích và các trụ có chi đó
    const khongVong = (() => { const s = mod(ngay.chi - ngay.can); return [mod(s + 10), mod(s + 11)]; })();
    const thanSat = [...THAN_SAT.map(([ten, theo, bang]) => {
      const dich = [].concat(theo === 'can' ? bang[nc] : bang[ngay.chi % 4]);
      return { ten, chi: dich.map((c) => CHI[c]), tru: co.filter((p) => p.ten !== 'Ngày' || theo === 'can').filter((p) => dich.includes(p.chi)).map((p) => p.ten) };
    }), { ten: 'Không Vong', chi: khongVong.map((c) => CHI[c]), tru: co.filter((p) => p.ten !== 'Ngày' && khongVong.includes(p.chi)).map((p) => p.ten) }];

    // Tiết đang ở và tiết kế tiếp (giờ Việt Nam)
    const tietTruoc = ngayGio(tietLuc(mod(315 + 30 * k, 360), jd - mod(lam - 315 - 30 * k, 360) / 0.98565));
    const tietSau = ngayGio(tietLuc(mod(315 + 30 * (k + 1), 360), jd + mod(315 + 30 * (k + 1) - lam, 360) / 0.98565));

    return {
      input: { ...input, options: opt },
      ten: input.name || '', gioiTinh: male ? 'Nam' : 'Nữ', noHour,
      duongLich: { day: solar.day, month: solar.month, year: solar.year, hour: Math.floor(minutes / 60), minute: minutes % 60 },
      amLich: lunar, namBatTu: namBT, tuoi: tenCC(nam.can, nam.chi), napAmNam: E.napAm(nam.can, nam.chi),
      tru, thaiNguyen, menhCung,
      nhatChu: { can: nc, ten: CAN[nc], hanh: H, ad: amDuong(nc) },
      nguHanh: { diem, dem, thieu, manh, tyLe: Math.round(ty * 100), duocLenh, hy },
      tiet: { ten: TIET[k], luc: tietTruoc, ke: TIET[(k + 1) % 12], keLuc: tietSau },
      daiVan, dvNay, thuan, khoiVan: { ...khoi, ngayToiTiet: Math.round(ngayToiTiet * 10) / 10, tuoi: tuoiKhoi },
      luuNien, namXem, thanSat,
    };
  }

  // ---------- Lời giải nghĩa (tự biên soạn) ----------
  // Nhật chủ: tính cách theo can ngày
  const NHAT_CHU = [
    'Giáp Mộc như cây lớn: thẳng thắn, có chí vươn lên, thích làm người đi đầu; cần học cách mềm dẻo khi gặp gió ngược.',
    'Ất Mộc như cây cỏ, dây leo: mềm mỏng, khéo thích nghi, giỏi dựa vào môi trường để lớn; đôi khi thiếu quyết đoán.',
    'Bính Hỏa như mặt trời: nhiệt tình, cởi mở, thích được thấy và soi sáng người khác; dễ nóng vội và hết hứng nhanh.',
    'Đinh Hỏa như ngọn đèn: tinh tế, chu đáo, sâu sắc, sưởi ấm người gần mình; hay lo nghĩ và nhạy cảm.',
    'Mậu Thổ như núi lớn: vững vàng, đáng tin, chịu đựng tốt, là chỗ dựa cho người khác; có lúc cứng nhắc, chậm đổi thay.',
    'Kỷ Thổ như đất vườn: bao dung, chăm chút, giỏi nuôi dưỡng và sắp xếp; dễ ôm việc và lo cho người khác quá mức.',
    'Canh Kim như sắt thép: quyết đoán, trọng nghĩa, dám làm dám chịu; nói thẳng nên dễ va chạm.',
    'Tân Kim như vàng bạc trang sức: tinh tế, trọng hình ảnh, cầu toàn; dễ tự ái và để ý lời người khác.',
    'Nhâm Thủy như sông lớn: thông minh, phóng khoáng, nhiều ý tưởng, thích tự do; dễ tản mạn, thiếu kiên trì.',
    'Quý Thủy như mưa móc: kín đáo, nhạy bén, giàu trực giác, giỏi quan sát; hay giữ suy nghĩ trong lòng.',
  ];
  // Thập thần: [nghĩa, khi xuất hiện nhiều, lời khuyên khi nhiều]
  const THAP_THAN = {
    'Tỷ Kiên': ['Anh em, bạn bè ngang hàng; tính tự lập, tự tin.', 'Cứng đầu, hay tranh phần, khó hợp tác về tiền bạc.', 'Hợp tác thì chia rõ quyền lợi bằng giấy tờ; biết nhường một bước trong việc nhỏ.'],
    'Kiếp Tài': ['Bạn bè, đối thủ cạnh tranh; tính quyết liệt, dám liều.', 'Dễ hao tiền vì bạn bè, cạnh tranh gay gắt, chi tiêu bốc đồng.', 'Không cho vay hay góp vốn khi chưa rõ ràng; giữ một khoản tiết kiệm riêng.'],
    'Thực Thần': ['Tài năng, sự hưởng thụ, con cái (với nữ); tính ôn hòa, sáng tạo.', 'Ham hưởng thụ, dễ dãi, thiếu áp lực để tiến lên.', 'Đặt mục tiêu có hạn chót; biến sở thích thành sản phẩm cụ thể.'],
    'Thương Quan': ['Tài hoa, khả năng biểu đạt, phá cách; thông minh, nói giỏi.', 'Nói thẳng dễ mất lòng cấp trên, coi thường khuôn phép.', 'Góp ý đúng lúc, đúng chỗ; dùng tài nói vào việc sáng tạo thay vì tranh cãi.'],
    'Thiên Tài': ['Tiền bất ngờ, kinh doanh, cha (truyền thống); hào phóng, nhạy cơ hội.', 'Tiền vào nhanh ra nhanh, ham làm ăn mạo hiểm.', 'Chia vốn thành phần an toàn và phần thử nghiệm; tránh dồn hết vào một vụ.'],
    'Chính Tài': ['Thu nhập ổn định, vợ (với nam); chăm chỉ, thực tế, biết tính toán.', 'Quá chặt chẽ chuyện tiền, ngại thay đổi.', 'Dành một phần cho học hỏi và cơ hội mới; tiền là công cụ chứ không phải đích.'],
    'Thất Sát': ['Áp lực, thử thách, quyền uy; gan dạ, dám đương đầu.', 'Áp lực lớn, dễ xung đột, căng thẳng, làm việc quá sức.', 'Chọn môi trường kỷ luật để dùng sức mạnh đúng chỗ; giữ sức khỏe và nhịp nghỉ ngơi.'],
    'Chính Quan': ['Kỷ luật, danh dự, cấp trên, chồng (với nữ); đứng đắn, có trách nhiệm.', 'Quá khuôn phép, sợ sai, nhiều ràng buộc.', 'Cho phép mình thử cái mới trong giới hạn an toàn; đừng để sợ sai thành đứng yên.'],
    'Thiên Ấn': ['Học thuật khác thường, trực giác, nghề chuyên môn; sâu sắc, độc lập.', 'Cô độc, đa nghi, bỏ dở giữa chừng.', 'Theo một chuyên môn đến cùng; giữ vài mối quan hệ thân thiết để không thu mình.'],
    'Chính Ấn': ['Học vấn, sự che chở, mẹ; hiền hậu, ham học, được giúp đỡ.', 'Dựa dẫm, thiếu chủ động, chậm hành động.', 'Học xong thì làm ngay; tự đứng ra nhận việc để rèn bản lĩnh.'],
  };
  const THAN_SAT_Y = {
    'Thiên Ất Quý Nhân': 'Sao quý nhân bậc nhất: gặp khó có người giúp, dễ được nâng đỡ.',
    'Văn Xương': 'Thông minh, học giỏi, có khiếu văn chương và thi cử.',
    'Lộc Thần': 'Có lộc ăn lộc làm, đời sống đủ đầy nhờ chính sức mình.',
    'Dương Nhận': 'Sức mạnh, quyết liệt như lưỡi dao: dùng đúng thì thành việc lớn, dùng sai dễ va chạm.',
    'Đào Hoa': 'Duyên dáng, được nhiều người mến; tình cảm phong phú.',
    'Dịch Mã': 'Hay di chuyển, đổi chỗ, đi xa; hợp việc năng động.',
    'Hoa Cái': 'Thông minh, thích nghệ thuật, triết lý, tôn giáo; có lúc thấy cô đơn.',
    'Không Vong': 'Trụ gặp Không Vong thì phần ý nghĩa của trụ đó giảm lực, việc liên quan dễ hụt hẫng.',
  };
  const THAN_SAT_KHUYEN = {
    'Dương Nhận': 'Dồn sức quyết liệt vào việc cần quyết đoán; tránh đối đầu, cẩn thận dao kéo, lái xe.',
    'Đào Hoa': 'Giữ ranh giới rõ ràng trong tình cảm, tránh để chuyện riêng ảnh hưởng công việc.',
    'Không Vong': 'Đừng đặt kỳ vọng quá cao vào việc thuộc trụ này; làm chắc từng bước và có phương án dự phòng.',
    'Hoa Cái': 'Dành thời gian cho người thân, bạn bè để cân bằng với thế giới riêng.',
  };
  // Bổ khuyết theo hành (quan niệm truyền thống)
  const HANH_BO = {
    Kim: 'màu trắng, xám, ánh kim; hướng Tây, Tây Bắc; nghề tài chính, cơ khí, luật, kỹ thuật; nếp sống ngăn nắp, kỷ luật.',
    'Mộc': 'màu xanh lá; hướng Đông, Đông Nam; nghề giáo dục, xuất bản, thiết kế, nông lâm; trồng cây, đọc sách, học thêm.',
    'Thủy': 'màu đen, xanh dương; hướng Bắc; nghề giao thương, vận tải, truyền thông, du lịch; đi lại, giao lưu nhiều hơn.',
    'Hỏa': 'màu đỏ, hồng, tím; hướng Nam; nghề năng lượng, ăn uống, biểu diễn, công nghệ; vận động, ra ngoài nắng sớm.',
    'Thổ': 'màu vàng, nâu; hướng Đông Bắc, Tây Nam; nghề bất động sản, xây dựng, nông nghiệp, quản lý; giữ nếp sống ổn định.',
  };
  const MANH_Y = {
    vuong: 'Nhật chủ thiên mạnh: tự tin, chủ động, chịu áp lực tốt; cần nơi để "xả" sức như công việc, sáng tạo, trách nhiệm.',
    hoa: 'Nhật chủ tương đối cân bằng: linh hoạt, ít bị cực đoan; vận tốt xấu phụ thuộc nhiều vào đại vận, lưu niên.',
    nhuoc: 'Nhật chủ thiên yếu: dễ chịu ảnh hưởng hoàn cảnh, cần người hỗ trợ và môi trường ổn định để phát huy.',
  };

  // Hồ sơ nhật chủ: hình ảnh, mô tả, điểm mạnh, điểm cần lưu ý
  const HO_SO = [
    { hinh: 'cây đại thụ', moTa: 'Giáp là Dương Mộc, hình ảnh cây đại thụ mọc thẳng lên trời. Người nhật chủ Giáp thường có chí lớn, thích tiến về phía trước và muốn đứng vững bằng chính sức mình. Họ trọng nguyên tắc, sống ngay thẳng, nhưng cũng như cây lớn, khó uốn theo hoàn cảnh.',
      tot: ['Có chí hướng rõ ràng, kiên định với mục tiêu', 'Ngay thẳng, trọng lời hứa', 'Có khả năng dẫn dắt, che chở người khác', 'Chịu khó, bền bỉ khi đã bắt tay làm', 'Hào phóng, sẵn lòng giúp đỡ'],
      xau: ['Cứng nhắc, khó chấp nhận ý kiến trái chiều', 'Tự tôn cao, ngại nhận sai', 'Hay ôm đồm, muốn tự làm hết', 'Thiếu linh hoạt khi hoàn cảnh đổi nhanh'] },
    { hinh: 'cỏ cây, dây leo', moTa: 'Ất là Âm Mộc, như cỏ cây và dây leo: mềm mại nhưng sức sống dai. Người nhật chủ Ất khéo thích nghi, biết tìm chỗ dựa và tận dụng hoàn cảnh để lớn lên. Họ tinh tế trong giao tiếp, có óc thẩm mỹ, nhưng đôi khi thiếu quyết đoán.',
      tot: ['Mềm dẻo, thích nghi nhanh', 'Khéo léo, giao tiếp dễ chịu', 'Có óc thẩm mỹ, yêu cái đẹp', 'Biết kết nối, giữ gìn các mối quan hệ', 'Kiên trì theo kiểu nước chảy đá mòn'],
      xau: ['Dễ dao động, ngại quyết định lớn', 'Hay dựa dẫm vào người khác', 'Đôi khi tính toán thiệt hơn quá kỹ', 'Dễ tổn thương khi bị chê'] },
    { hinh: 'mặt trời', moTa: 'Bính là Dương Hỏa, như mặt trời soi sáng muôn nơi. Người nhật chủ Bính nhiệt tình, cởi mở, thích được nhìn thấy và lan tỏa năng lượng. Họ rộng rãi, lạc quan, nhưng nóng vội và dễ hết hứng giữa chừng.',
      tot: ['Nhiệt tình, lạc quan, truyền năng lượng cho người xung quanh', 'Thẳng thắn, không để bụng lâu', 'Rộng rãi, hào phóng', 'Tự tin trước đám đông', 'Dám nghĩ dám làm'],
      xau: ['Nóng vội, thiếu kiên nhẫn', 'Thích được chú ý, dễ phô trương', 'Nhanh chán, hay bỏ dở', 'Nói thẳng đến mức vô tình làm mất lòng'] },
    { hinh: 'ngọn đèn, lửa bếp', moTa: 'Đinh là Âm Hỏa, như ngọn đèn dầu hay ánh lửa bếp: không chói chang nhưng ấm và bền. Người nhật chủ Đinh chu đáo, tinh ý, thường quan tâm người khác bằng những việc nhỏ. Bên trong họ nhiều suy tư, cảm xúc lên xuống nhanh hơn vẻ ngoài.',
      tot: ['Tinh ý, để ý tiểu tiết', 'Ân cần, chu đáo với người thân', 'Có chiều sâu, thích tìm hiểu', 'Giỏi gợi mở, dẫn dắt người khác từng bước', 'Làm việc cẩn thận, có trách nhiệm'],
      xau: ['Cảm xúc thất thường, dễ tự ái', 'Hay lo xa, suy nghĩ nhiều', 'Khi bực dễ nói lời làm người khác tổn thương', 'Khó buông bỏ chuyện đã qua'] },
    { hinh: 'núi lớn', moTa: 'Mậu là Dương Thổ, như núi lớn hay con đê: vững chãi và che chắn. Người nhật chủ Mậu điềm tĩnh, đáng tin, chịu được áp lực và thường là chỗ dựa cho người khác. Mặt trái là chậm thay đổi và có lúc bảo thủ.',
      tot: ['Điềm tĩnh, vững vàng trước biến động', 'Đáng tin, giữ chữ tín', 'Bao dung, che chở người thân', 'Kiên nhẫn, làm việc đường dài', 'Thực tế, ít viển vông'],
      xau: ['Chậm thích nghi với cái mới', 'Bảo thủ, khó lay chuyển', 'Ít bộc lộ cảm xúc nên dễ bị hiểu là lạnh lùng', 'Có lúc ì, ngại bắt đầu'] },
    { hinh: 'đất ruộng vườn', moTa: 'Kỷ là Âm Thổ, như đất ruộng vườn: mềm, ẩm và nuôi được cây trái. Người nhật chủ Kỷ chu toàn, khéo vun vén, giỏi chăm lo cho gia đình và tập thể. Họ thực tế, nhưng hay ôm việc và lo nghĩ thay người khác.',
      tot: ['Chu đáo, biết chăm sóc', 'Khéo sắp xếp việc nhà, việc chung', 'Khiêm tốn, dễ hòa đồng', 'Thực tế, biết tiết kiệm', 'Nhẫn nại, chịu thương chịu khó'],
      xau: ['Lo nghĩ nhiều, hay bận tâm chuyện nhỏ', 'Ôm việc, khó từ chối', 'Đôi khi đa nghi, giữ ý', 'Thiếu tự tin để đứng ra dẫn dắt'] },
    { hinh: 'sắt thép, lưỡi rìu', moTa: 'Canh là Dương Kim, như sắt thép chưa rèn hay lưỡi rìu: cứng, sắc và mạnh. Người nhật chủ Canh quyết đoán, trọng nghĩa khí, dám làm dám chịu. Cần được rèn qua thử thách mới thành đồ quý; nếu không dễ thô cứng, nóng nảy.',
      tot: ['Quyết đoán, hành động nhanh', 'Trọng nghĩa, bênh vực lẽ phải', 'Can đảm, không ngại khó', 'Nói là làm, rõ ràng', 'Chịu được áp lực, cạnh tranh'],
      xau: ['Nóng nảy, dễ va chạm', 'Nói thẳng thiếu khéo', 'Cứng đầu, thích hơn thua', 'Có lúc liều lĩnh'] },
    { hinh: 'vàng bạc, đá quý', moTa: 'Tân là Âm Kim, như vàng bạc, đá quý đã qua chế tác: đẹp, tinh và có giá. Người nhật chủ Tân coi trọng hình ảnh, cầu toàn, có gu và nhạy với cái đẹp. Họ cần được trân trọng, nên cũng dễ tự ái khi bị coi nhẹ.',
      tot: ['Tinh tế, có gu thẩm mỹ', 'Cầu toàn, làm việc kỹ', 'Lịch sự, giữ hình ảnh tốt', 'Nhạy bén, thông minh', 'Có lòng tự trọng cao'],
      xau: ['Dễ tự ái, để ý lời người khác', 'Cầu toàn quá thành khắt khe', 'Đôi khi trọng vẻ ngoài', 'Khó chịu khi môi trường thô ráp'] },
    { hinh: 'sông lớn, biển cả', moTa: 'Nhâm là Dương Thủy, như sông lớn, biển cả: chảy mãi và chứa được nhiều. Người nhật chủ Nhâm thông minh, nhanh trí, phóng khoáng, thích tự do và trải nghiệm. Sức mạnh lớn nhưng cần bờ đê; thiếu kỷ luật thì dễ tản mạn.',
      tot: ['Thông minh, học nhanh', 'Phóng khoáng, cởi mở', 'Giỏi xoay chuyển, nhiều ý tưởng', 'Giao thiệp rộng', 'Thích khám phá, không sợ cái mới'],
      xau: ['Thiếu kiên trì, dễ chán', 'Khó gò mình vào khuôn khổ', 'Đôi khi tùy hứng, hứa nhiều làm ít', 'Dễ buông thả khi không có mục tiêu'] },
    { hinh: 'mưa phùn, sương sớm', moTa: 'Quý là Âm Thủy, như mưa phùn, sương sớm: nhỏ nhẹ mà thấm sâu. Người nhật chủ Quý kín đáo, giàu trực giác, quan sát tốt và hiểu người. Họ hay giữ suy nghĩ trong lòng, dễ lo âu nếu không có chỗ chia sẻ.',
      tot: ['Trực giác tốt, nhạy với cảm xúc người khác', 'Kín đáo, biết giữ bí mật', 'Kiên nhẫn, bền bỉ âm thầm', 'Giàu trí tưởng tượng', 'Mềm mỏng, khéo hòa giải'],
      xau: ['Hay lo âu, nghĩ theo hướng xấu', 'Khép kín, ít bày tỏ', 'Đôi khi đa nghi', 'Dễ bị cảm xúc chi phối'] },
  ];
  const TRUONG_SINH_Y = {
    'Trường Sinh': 'Giai đoạn mới sinh: sức sống bắt đầu, nhiều tiềm năng.',
    'Mộc Dục': 'Như tắm gội lúc mới sinh: còn non, dễ dao động, hay gắn với chuyện tình cảm.',
    'Quan Đới': 'Như mặc áo đội mũ: bắt đầu trưởng thành, muốn khẳng định mình.',
    'Lâm Quan': 'Như ra làm quan: sức vững, tự lập được.',
    'Đế Vượng': 'Đỉnh cao sức mạnh; mạnh quá thì cần biết giữ.',
    'Suy': 'Bắt đầu đi xuống: chín chắn hơn, nên giữ hơn là mở rộng.',
    'Bệnh': 'Sức yếu dần: cần nghỉ ngơi, cẩn trọng.',
    'Tử': 'Sức gần như ngừng: nên tĩnh, tích lũy cho chu kỳ sau.',
    'Mộ': 'Như vào kho: thu giữ, cất chứa; tốt cho tích lũy.',
    'Tuyệt': 'Điểm tận cùng: cái cũ hết, chuẩn bị cho cái mới.',
    'Thai': 'Bắt đầu thụ thai: mầm mống mới hình thành.',
    'Dưỡng': 'Được nuôi dưỡng trong bụng mẹ: chuẩn bị ra đời.',
  };
  // Biểu tượng: thiên can, con giáp (phái Việt: Mão là mèo, Sửu là trâu), chữ Hán ngũ hành
  const HINH_CAN = ['🌳', '🌿', '☀️', '🕯️', '⛰️', '🌾', '⚔️', '💍', '🌊', '🌧️'];
  const HINH_CHI = ['🐭', '🐃', '🐯', '🐱', '🐲', '🐍', '🐴', '🐐', '🐵', '🐓', '🐶', '🐷'];
  const CON_GIAP = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];
  const HAN_HANH = { Kim: '金', 'Mộc': '木', 'Thủy': '水', 'Hỏa': '火', 'Thổ': '土' };
  // Nhóm thập thần của một hành so với nhật chủ hành H
  const nhomTT = (H, x) => (x === H ? 'Tỷ Kiếp' : x === ME[H] ? 'Ấn' : x === SINH[H] ? 'Thực Thương' : x === KHAC[H] ? 'Tài' : 'Quan Sát');
  const NHOM_Y = { 'Tỷ Kiếp': 'bản thân, anh em, bạn bè', 'Ấn': 'học vấn, sự che chở', 'Thực Thương': 'tài năng, sự thể hiện', 'Tài': 'tiền bạc, của cải', 'Quan Sát': 'kỷ luật, áp lực, danh vị' };

  return { compute, thapThan, truongSinh, nhomTT, CAN_HANH, CHI_HANH, HANH, SINH, KHAC, TANG_CAN, TRU,
    NHAT_CHU, THAP_THAN, THAN_SAT_Y, THAN_SAT_KHUYEN, HANH_BO, MANH_Y, HO_SO, TRUONG_SINH_Y, HINH_CAN, HINH_CHI, CON_GIAP, HAN_HANH, NHOM_Y };
})();
if (typeof module !== 'undefined') module.exports = TuViBatTu;
