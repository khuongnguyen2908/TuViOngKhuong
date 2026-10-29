// Engine an sao Tử Vi Đẩu Số — phái Việt Nam.
// Quy tắc an sao theo sách Tử Vi Việt phổ biến; bảng độ sáng và ngũ hành sao tham khảo
// lasotuvi (MIT License, © 2016 doanguyen — https://github.com/doanguyen/lasotuvi).
// Đã sửa so với lasotuvi: Khôi/Việt năm Mậu, thứ tự Thai/Dưỡng, Phá Toái, Mệnh chủ/Thân chủ.

const TuViEngine = (() => {
  const L = (typeof LunarVN !== 'undefined') ? LunarVN : require('./lunar.js');
  const { CAN, CHI } = L;
  const mod = (n) => ((n % 12) + 12) % 12;

  const CUNG = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];
  const NAP_AM = ['Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa',
    'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ',
    'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc',
    'Bích Thượng Thổ', 'Kim Bạch Kim', 'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim',
    'Tang Đố Mộc', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'];
  const NAP_AM_NGHIA = ['Vàng trong biển', 'Lửa trong lò', 'Gỗ rừng lớn', 'Đất ven đường', 'Vàng mũi kiếm', 'Lửa trên núi',
    'Nước dưới khe', 'Đất trên thành', 'Vàng chân đèn', 'Gỗ cây dương liễu', 'Nước giữa suối', 'Đất mái nhà',
    'Lửa sấm sét', 'Gỗ tùng bách', 'Nước chảy dài', 'Vàng trong cát', 'Lửa dưới núi', 'Gỗ đồng bằng',
    'Đất trên vách', 'Vàng pha bạc', 'Lửa ngọn đèn', 'Nước trên trời', 'Đất bãi lớn', 'Vàng trang sức',
    'Gỗ cây dâu', 'Nước khe lớn', 'Đất pha cát', 'Lửa trên trời', 'Gỗ cây lựu', 'Nước biển lớn'];
  // Âm dương của 14 chính tinh (dấu + / − trên lá số)
  const CHINH_AM_DUONG = { 'Tử Vi': 1, 'Thái Dương': 1, 'Thiên Đồng': 1, 'Thất Sát': 1, 'Thiên Tướng': 1,
    'Liêm Trinh': -1, 'Thiên Cơ': -1, 'Thái Âm': -1, 'Vũ Khúc': -1, 'Phá Quân': -1, 'Tham Lang': -1, 'Cự Môn': -1, 'Thiên Lương': -1, 'Thiên Phủ': -1 };
  // Ngũ hành của 12 cung theo chi
  const CUNG_HANH = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
  // Cân xương (đơn vị chỉ; 10 chỉ = 1 lượng): năm theo 60 hoa giáp, tháng, ngày, giờ âm lịch
  const CX_NAM = [12, 9, 6, 7, 12, 5, 9, 8, 7, 8, 15, 9, 16, 8, 8, 19, 12, 6, 8, 7, 5, 15, 6, 16, 15, 7, 9, 12, 10, 7,
    15, 6, 5, 14, 14, 9, 7, 7, 9, 12, 8, 7, 13, 5, 14, 5, 9, 17, 5, 7, 12, 8, 8, 6, 19, 6, 8, 16, 10, 6];
  const CX_THANG = [6, 7, 18, 9, 5, 16, 9, 15, 18, 8, 9, 5];
  const CX_NGAY = [5, 10, 8, 15, 16, 15, 8, 16, 8, 16, 9, 17, 8, 17, 10, 8, 9, 18, 5, 15, 10, 9, 8, 9, 15, 18, 7, 8, 16, 6];
  const CX_GIO = [16, 6, 7, 10, 9, 16, 10, 8, 8, 9, 6, 6];
  const HANH = { K: 'Kim', M: 'Mộc', T: 'Thủy', H: 'Hỏa', O: 'Thổ' };
  const CUC = { Kim: 4, 'Mộc': 3, 'Thủy': 2, 'Hỏa': 6, 'Thổ': 5 };
  const CUC_TEN = { 2: 'Thủy nhị cục', 3: 'Mộc tam cục', 4: 'Kim tứ cục', 5: 'Thổ ngũ cục', 6: 'Hỏa lục cục' };
  const SINH = { Kim: 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  const KHAC = { Kim: 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };
  const TRANG_SINH = ['Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
  const BAC_SI = ['Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao', 'Tướng Quân', 'Tấu Thư', 'Phi Liêm', 'Hỷ Thần', 'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ'];
  const THAI_TUE = ['Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm', 'Quan Phù', 'Tử Phù', 'Tuế Phá', 'Long Đức', 'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù'];
  const MENH_CHU = ['Tham Lang', 'Cự Môn', 'Lộc Tồn', 'Văn Khúc', 'Liêm Trinh', 'Vũ Khúc', 'Phá Quân', 'Vũ Khúc', 'Liêm Trinh', 'Văn Khúc', 'Lộc Tồn', 'Cự Môn'];
  const THAN_CHU = ['Linh Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ', 'Hỏa Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ'];

  // Ngũ hành sao (theo lasotuvi)
  const STAR_HANH = {
    'Tử Vi': 'O', 'Liêm Trinh': 'H', 'Thiên Đồng': 'T', 'Vũ Khúc': 'K', 'Thái Dương': 'H', 'Thiên Cơ': 'M', 'Thiên Phủ': 'O',
    'Thái Âm': 'T', 'Tham Lang': 'M', 'Cự Môn': 'T', 'Thiên Tướng': 'T', 'Thiên Lương': 'M', 'Thất Sát': 'K', 'Phá Quân': 'T',
    'Thái Tuế': 'H', 'Thiếu Dương': 'H', 'Tang Môn': 'M', 'Thiếu Âm': 'T', 'Quan Phù': 'H', 'Tử Phù': 'K', 'Tuế Phá': 'H',
    'Long Đức': 'T', 'Bạch Hổ': 'K', 'Phúc Đức': 'O', 'Điếu Khách': 'H', 'Trực Phù': 'K', 'Lộc Tồn': 'O', 'Bác Sĩ': 'T',
    'Lực Sĩ': 'H', 'Thanh Long': 'T', 'Tiểu Hao': 'H', 'Tướng Quân': 'M', 'Tấu Thư': 'K', 'Phi Liêm': 'H', 'Hỷ Thần': 'H',
    'Bệnh Phù': 'O', 'Đại Hao': 'H', 'Phục Binh': 'H', 'Quan Phủ': 'H', 'Đà La': 'K', 'Kình Dương': 'K', 'Địa Không': 'H',
    'Địa Kiếp': 'H', 'Linh Tinh': 'H', 'Hỏa Tinh': 'H', 'Văn Xương': 'K', 'Văn Khúc': 'T', 'Thiên Khôi': 'H', 'Thiên Việt': 'H',
    'Tả Phù': 'O', 'Hữu Bật': 'T', 'Long Trì': 'T', 'Phượng Các': 'O', 'Tam Thai': 'M', 'Bát Tọa': 'M', 'Ân Quang': 'M',
    'Thiên Quý': 'O', 'Thiên Khốc': 'T', 'Thiên Hư': 'T', 'Thiên Đức': 'H', 'Nguyệt Đức': 'H', 'Thiên Hình': 'H',
    'Thiên Riêu': 'T', 'Thiên Y': 'T', 'Quốc Ấn': 'O', 'Đường Phù': 'M', 'Đào Hoa': 'M', 'Hồng Loan': 'T', 'Thiên Hỷ': 'T',
    'Thiên Giải': 'H', 'Địa Giải': 'O', 'Giải Thần': 'M', 'Thai Phụ': 'K', 'Phong Cáo': 'O', 'Thiên Tài': 'O', 'Thiên Thọ': 'O',
    'Thiên Thương': 'O', 'Thiên Sứ': 'T', 'Thiên La': 'O', 'Địa Võng': 'O', 'Hóa Khoa': 'T', 'Hóa Quyền': 'T', 'Hóa Lộc': 'M',
    'Hóa Kỵ': 'T', 'Cô Thần': 'O', 'Quả Tú': 'O', 'Thiên Mã': 'H', 'Phá Toái': 'H', 'Thiên Quan': 'H', 'Thiên Phúc': 'H',
    'Lưu Hà': 'T', 'Thiên Trù': 'O', 'Kiếp Sát': 'H', 'Hoa Cái': 'K', 'Văn Tinh': 'K', 'Đẩu Quân': 'H', 'Thiên Không': 'H',
  };

  // Độ sáng theo cung Tý..Hợi (M Miếu, V Vượng, Đ Đắc, B Bình hòa, H Hãm); bảng lasotuvi, thêm Thiên Phủ
  const S = (s) => s.split(' ').map((x) => (x === '-' ? null : x));
  const BRIGHT = {
    'Tử Vi': S('B Đ M B V M M Đ M B V B'), 'Liêm Trinh': S('V Đ V H M H V Đ V H M H'),
    'Thiên Đồng': S('V H M Đ H Đ H H M H H Đ'), 'Vũ Khúc': S('V M V Đ M H V M V Đ M H'),
    'Thái Dương': S('H Đ V V V M M Đ H H H H'), 'Thiên Cơ': S('Đ Đ H M M V Đ Đ V M M H'),
    'Thiên Phủ': S('M B M B V Đ M Đ M B V Đ'), 'Thái Âm': S('V Đ H H H H H Đ V M M M'),
    'Tham Lang': S('H M Đ H V H H M Đ H V H'), 'Cự Môn': S('V H V M H H V H Đ M H Đ'),
    'Thiên Tướng': S('V Đ M H V Đ V Đ M H V Đ'), 'Thiên Lương': S('V Đ V V M H M Đ V H M H'),
    'Thất Sát': S('M Đ M H H V M Đ M H H V'), 'Phá Quân': S('M V H H Đ H M V H H Đ H'),
    'Đà La': S('H Đ H H Đ H H Đ H H Đ H'), 'Kình Dương': S('H Đ H H Đ H H Đ H H Đ H'),
    'Linh Tinh': S('H H Đ Đ Đ Đ Đ H H H H H'), 'Hỏa Tinh': S('H H Đ Đ Đ Đ Đ H H H H H'),
    'Văn Xương': S('H Đ H Đ H Đ H Đ H H Đ Đ'), 'Văn Khúc': S('H Đ H Đ H Đ H Đ H H Đ Đ'),
    'Địa Không': S('H H Đ H H Đ H H Đ H H Đ'), 'Địa Kiếp': S('H H Đ H H Đ H H Đ H H Đ'),
    'Hóa Kỵ': S('H Đ H H Đ H H Đ H H Đ H'), 'Tang Môn': S('H H Đ Đ H H H H Đ Đ H H'), 'Đại Hao': S('- - Đ Đ - - - - Đ Đ - -'),
    'Tiểu Hao': S('- - Đ Đ - - - - Đ Đ - -'), 'Thiên Khốc': S('Đ Đ - Đ - - Đ Đ - Đ - -'),
    'Thiên Hư': S('Đ Đ - Đ - - Đ Đ - Đ - -'), 'Thiên Mã': S('- - Đ - - Đ - - H - - H'),
    'Thiên Hình': S('- - Đ Đ - - - - Đ Đ - -'), 'Thiên Riêu': S('H H Đ Đ H H H H H Đ Đ H'),
  };

  const HUNG = new Set(['Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp', 'Hỏa Tinh', 'Linh Tinh', 'Hóa Kỵ', 'Thái Tuế', 'Tang Môn',
    'Quan Phù', 'Tử Phù', 'Tuế Phá', 'Bạch Hổ', 'Điếu Khách', 'Trực Phù', 'Tiểu Hao', 'Đại Hao', 'Tướng Quân', 'Phi Liêm',
    'Bệnh Phù', 'Phục Binh', 'Quan Phủ', 'Thiên Không', 'Thiên Hình', 'Thiên Riêu', 'Thiên Khốc', 'Thiên Hư', 'Cô Thần',
    'Quả Tú', 'Thiên Thương', 'Thiên Sứ', 'Thiên La', 'Địa Võng', 'Lưu Hà', 'Kiếp Sát', 'Phá Toái', 'Đẩu Quân']);
  const CHINH_TINH = ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh', 'Thiên Phủ', 'Thái Âm',
    'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'];
  // Thứ tự hiển thị phụ tinh trong mỗi cung
  const ORDER = ['Lộc Tồn', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt', 'Tả Phù', 'Hữu Bật',
    'Thiên Mã', 'Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tấu Thư', 'Hỷ Thần', 'Thiếu Dương', 'Thiếu Âm', 'Long Đức', 'Phúc Đức',
    'Long Trì', 'Phượng Các', 'Giải Thần', 'Tam Thai', 'Bát Tọa', 'Ân Quang', 'Thiên Quý', 'Thiên Quan', 'Thiên Phúc',
    'Thiên Đức', 'Nguyệt Đức', 'Thiên Hỷ', 'Hồng Loan', 'Đào Hoa', 'Thiên Tài', 'Thiên Thọ', 'Thai Phụ', 'Phong Cáo',
    'Quốc Ấn', 'Đường Phù', 'Văn Tinh', 'Thiên Giải', 'Địa Giải', 'Thiên Y', 'Thiên Trù', 'Hoa Cái',
    'Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp', 'Hỏa Tinh', 'Linh Tinh', 'Hóa Kỵ', 'Thái Tuế', 'Tang Môn', 'Quan Phù',
    'Tử Phù', 'Tuế Phá', 'Bạch Hổ', 'Điếu Khách', 'Trực Phù', 'Quan Phủ', 'Tiểu Hao', 'Đại Hao', 'Tướng Quân', 'Phi Liêm',
    'Bệnh Phù', 'Phục Binh', 'Thiên Không', 'Thiên Hình', 'Thiên Riêu', 'Thiên Khốc', 'Thiên Hư', 'Cô Thần', 'Quả Tú',
    'Thiên Thương', 'Thiên Sứ', 'Thiên La', 'Địa Võng', 'Lưu Hà', 'Kiếp Sát', 'Phá Toái', 'Đẩu Quân'];
  const ORDER_IDX = Object.fromEntries(ORDER.map((n, i) => [n, i]));

  const LOC_TON = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
  const THIEN_QUAN = [7, 4, 5, 2, 3, 9, 11, 9, 10, 6];
  const THIEN_PHUC = [9, 8, 0, 11, 3, 2, 6, 5, 6, 5];
  const LUU_HA = [9, 10, 7, 4, 5, 6, 8, 3, 11, 2];
  const THIEN_TRU = [5, 6, 0, 5, 6, 8, 2, 6, 9, 10];
  const TRIET = [[8, 9], [6, 7], [4, 5], [2, 3], [0, 1], [8, 9], [6, 7], [4, 5], [2, 3], [0, 1]];

  const DEFAULT_OPTIONS = {
    menhChu: 'chiNam',          // 'chiNam' | 'cungMenh'
    hoaLinhTyDauSuu: 'mao-tuat', // Tỵ Dậu Sửu: Hỏa khởi Mão, Linh khởi Tuất | 'tuat-mao'
    khoiVietCanh: 'suu-mui',    // năm Canh: Khôi Sửu, Việt Mùi | 'ngo-dan'
    trangSinhTho: 'than',       // Thổ cục khởi Tràng Sinh ở Thân | 'dan'
    tuHoaCanh: 'am-dong',       // Canh: Nhật Vũ Âm Đồng | 'dong-am' (Nhật Vũ Đồng Âm)
    tuHoaNham: 'phu',           // Nhâm: Hóa Khoa ở Thiên Phủ | 'ta-phu'
    thienGiai: 'thuong',        // Thiên Giải: từ Thân đếm thuận theo tháng | 'nhay' (nhảy cung)
    thangNhuan: 'thangChinh',   // tháng nhuận an như tháng chính | 'chiaDoi'
    gioTy: 'ngaySau',           // 23h–24h tính sang ngày hôm sau | 'ngayHienTai'
  };

  const giapTy = (can, chi) => { let n = 0; while (n % 10 !== can || n % 12 !== chi) n++; return n; };
  function napAm(can, chi) {
    const i = Math.floor(giapTy(can, chi) / 2);
    const ten = NAP_AM[i];
    return { ten, nghia: NAP_AM_NGHIA[i], hanh: ten.split(' ').pop() };
  }

  function quanHe(menh, cuc) {
    if (menh === cuc) return 'Mệnh Cục bình hòa';
    if (SINH[menh] === cuc) return 'Bản Mệnh sinh Cục';
    if (SINH[cuc] === menh) return 'Cục sinh Bản Mệnh';
    if (KHAC[menh] === cuc) return 'Bản Mệnh khắc Cục';
    return 'Cục khắc Bản Mệnh';
  }

  // input: {name, gender:'nam'|'nu', calendar:'duong'|'am', day, month, year, leap, hour, minute, clockTz, namXem, options}
  function compute(input) {
    const opt = { ...DEFAULT_OPTIONS, ...(input.options || {}) };
    const cal = L.makeCalendar(7);
    const male = input.gender !== 'nu';
    const g = male ? 1 : -1;

    // 1. Ngày giờ dương lịch theo giờ Việt Nam (UTC+7)
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
    let minutes = (input.hour || 0) * 60 + (input.minute || 0) - ((input.clockTz || 7) - 7) * 60;
    while (minutes < 0) { minutes += 1440; solarJdn -= 1; }
    while (minutes >= 1440) { minutes -= 1440; solarJdn += 1; }
    const h = Math.floor((minutes + 60) / 120) % 12; // chi giờ, Tý = 0
    const lateTy = minutes >= 23 * 60;
    const dayJdn = (lateTy && opt.gioTy === 'ngaySau') ? solarJdn + 1 : solarJdn;
    const solarAdj = L.fromJdn(solarJdn);
    const dayDate = L.fromJdn(dayJdn);
    const lunar = cal.solarToLunar(dayDate.day, dayDate.month, dayDate.year);

    const d = lunar.day;
    let m = lunar.month;
    if (lunar.leap && opt.thangNhuan === 'chiaDoi' && d > 15) m = (m % 12) + 1;
    const yc = L.yearCanChi(lunar.year);
    const c = yc.can, z = yc.chi;
    const duongNam = c % 2 === 0; // can dương
    const ad = (duongNam ? 1 : -1) * g; // 1: thuận, -1: nghịch
    const mcc = L.monthCanChi(lunar.year, lunar.month);
    const dcc = L.dayCanChi(dayJdn);
    const hcc = L.hourCanChi(dcc.can, h);

    // 2. Cung Mệnh, Thân, tên 12 cung, can các cung
    const menh = mod(2 + (m - 1) - h);
    const than = mod(2 + (m - 1) + h);
    const canDan = ((c % 5) * 2 + 2) % 10;
    const canCung = (p) => (canDan + mod(p - 2)) % 10;

    // 3. Cục
    const menhNA = napAm(canCung(menh), menh);
    const cuc = CUC[menhNA.hanh];
    const banMenh = napAm(c, z);

    // 4. Sao
    const stars = Array.from({ length: 12 }, () => []);
    const pos = {};
    const put = (p, name, extra) => { p = mod(p); pos[name] = p; stars[p].push({ name, ...(extra || {}) }); };

    // Tử Vi tinh hệ
    let q = 1;
    while (q * cuc < d) q++;
    const diff = q * cuc - d;
    const tv = mod(2 + (q - 1) + (diff % 2 === 1 ? -diff : diff));
    put(tv, 'Tử Vi');
    put(tv + 11, 'Thiên Cơ'); put(tv + 9, 'Thái Dương'); put(tv + 8, 'Vũ Khúc'); put(tv + 7, 'Thiên Đồng'); put(tv + 4, 'Liêm Trinh');
    const tp = mod(4 - tv);
    put(tp, 'Thiên Phủ'); put(tp + 1, 'Thái Âm'); put(tp + 2, 'Tham Lang'); put(tp + 3, 'Cự Môn');
    put(tp + 4, 'Thiên Tướng'); put(tp + 5, 'Thiên Lương'); put(tp + 6, 'Thất Sát'); put(tp + 10, 'Phá Quân');

    // Vòng Lộc Tồn – Bác Sĩ
    const lt = LOC_TON[c];
    put(lt, 'Lộc Tồn');
    BAC_SI.forEach((n, i) => put(lt + i * ad, n));
    put(lt + 1, 'Kình Dương'); put(lt - 1, 'Đà La');

    // Vòng Thái Tuế
    THAI_TUE.forEach((n, i) => put(z + i, n));
    put(z + 1, 'Thiên Không'); put(z + 5, 'Nguyệt Đức'); put(z + 9, 'Thiên Đức');

    // Vòng Tràng Sinh
    let ts = { 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 }[cuc];
    if (cuc === 5 && opt.trangSinhTho === 'dan') ts = 2;
    const trangSinh = Array(12).fill('');
    TRANG_SINH.forEach((n, i) => { trangSinh[mod(ts + i * ad)] = n; });

    // Không Kiếp, Hỏa Linh
    put(11 + h, 'Địa Kiếp'); put(11 - h, 'Địa Không');
    let hoaStart, linhStart;
    if ([2, 6, 10].includes(z)) { hoaStart = 1; linhStart = 3; }
    else if ([8, 0, 4].includes(z)) { hoaStart = 2; linhStart = 10; }
    else if ([5, 9, 1].includes(z)) { [hoaStart, linhStart] = opt.hoaLinhTyDauSuu === 'tuat-mao' ? [10, 3] : [3, 10]; }
    else { hoaStart = 9; linhStart = 10; }
    put(hoaStart + ad * h, 'Hỏa Tinh'); put(linhStart - ad * h, 'Linh Tinh');

    // Xương Khúc, Tả Hữu, Long Phượng, Thai Tọa, Quang Quý
    put(4 + h, 'Văn Khúc'); put(10 - h, 'Văn Xương');
    put(4 + (m - 1), 'Tả Phù'); put(10 - (m - 1), 'Hữu Bật');
    put(4 + z, 'Long Trì'); put(10 - z, 'Phượng Các'); put(10 - z, 'Giải Thần');
    put(pos['Tả Phù'] + (d - 1), 'Tam Thai'); put(pos['Hữu Bật'] - (d - 1), 'Bát Tọa');
    put(pos['Văn Xương'] + (d - 2), 'Ân Quang'); put(pos['Văn Khúc'] - (d - 2), 'Thiên Quý');

    // Khôi Việt, Quan Phúc
    let kv;
    if ([0, 4].includes(c) || (c === 6 && opt.khoiVietCanh === 'suu-mui')) kv = [1, 7];
    else if ([1, 5].includes(c)) kv = [0, 8];
    else if ([2, 3].includes(c)) kv = [11, 9];
    else if ([8, 9].includes(c)) kv = [3, 5];
    else kv = [6, 2]; // Tân (và Canh theo cách 'ngo-dan')
    put(kv[0], 'Thiên Khôi'); put(kv[1], 'Thiên Việt');
    put(THIEN_QUAN[c], 'Thiên Quan'); put(THIEN_PHUC[c], 'Thiên Phúc');

    // Khốc Hư, Tài Thọ, Loan Hỷ, Hình Riêu Y, Cô Quả
    put(6 + z, 'Thiên Hư'); put(6 - z, 'Thiên Khốc');
    put(menh + z, 'Thiên Tài'); put(than + z, 'Thiên Thọ');
    put(3 - z, 'Hồng Loan'); put(3 - z + 6, 'Thiên Hỷ');
    put(9 + (m - 1), 'Thiên Hình'); put(1 + (m - 1), 'Thiên Riêu'); put(1 + (m - 1), 'Thiên Y');
    const coThan = [2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11, 2][z];
    put(coThan, 'Cô Thần'); put(coThan - 4, 'Quả Tú');

    // Văn Tinh, Đường Phù, Quốc Ấn, Thai Phụ, Phong Cáo, Giải
    put(lt + 3, 'Văn Tinh'); put(lt + 5, 'Đường Phù'); put(lt + 8, 'Quốc Ấn');
    put(pos['Văn Khúc'] + 2, 'Thai Phụ'); put(pos['Văn Khúc'] - 2, 'Phong Cáo');
    put(8 + (m - 1) * (opt.thienGiai === 'nhay' ? 2 : 1), 'Thiên Giải');
    put(7 + (m - 1), 'Địa Giải');

    // Cố định & theo cung
    put(4, 'Thiên La'); put(10, 'Địa Võng');
    put(menh + 5, 'Thiên Thương'); put(menh + 7, 'Thiên Sứ');

    // Vòng Thiên Mã, Phá Toái, Đẩu Quân, Lưu Hà, Thiên Trù
    const ma = [2, 11, 8, 5][z % 4];
    put(ma, 'Thiên Mã'); put(ma + 2, 'Hoa Cái'); put(ma + 3, 'Kiếp Sát'); put(ma + 7, 'Đào Hoa');
    put([5, 1, 9][z % 3] , 'Phá Toái');
    put(z - (m - 1) + h, 'Đẩu Quân');
    put(LUU_HA[c], 'Lưu Hà'); put(THIEN_TRU[c], 'Thiên Trù');

    // Tứ hóa
    const TU_HOA = [
      ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],
      ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],
      ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],
      ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],
      ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],
      ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],
      opt.tuHoaCanh === 'dong-am' ? ['Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Thái Âm'] : ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],
      ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],
      ['Thiên Lương', 'Tử Vi', opt.tuHoaNham === 'ta-phu' ? 'Tả Phù' : 'Thiên Phủ', 'Vũ Khúc'],
      ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],
    ];
    const HOA = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
    const hoaOf = {};
    TU_HOA[c].forEach((star, i) => { hoaOf[star] = HOA[i]; put(pos[star], HOA[i]); });

    // Tuần, Triệt
    const tuanEnd = z + (9 - c);
    const tuan = [mod(tuanEnd + 1), mod(tuanEnd + 2)];
    const triet = TRIET[c];

    // 5. Hạn
    const tieuStart = mod(10 - 3 * z);
    const tieuHanChi = Array.from({ length: 12 }, (_, p) => mod(z + g * (p - tieuStart)));
    const namXem = input.namXem || new Date().getFullYear();
    const xem = L.yearCanChi(namXem);
    const tuoi = namXem - lunar.year + 1;
    const tieuHanPalace = mod(tieuStart + g * (xem.chi - z));
    const thang1 = mod(tieuHanPalace - (m - 1) + h);
    const luuNguyet = Array.from({ length: 12 }, (_, p) => mod(p - thang1) + 1);

    const palaces = Array.from({ length: 12 }, (_, p) => {
      const offset = mod(p - menh);
      const dist = ad === 1 ? mod(p - menh) : mod(menh - p);
      const daiHan = cuc + dist * 10;
      const list = stars[p].map((s) => {
        const b = BRIGHT[s.name] ? BRIGHT[s.name][p] : null;
        return { name: s.name, hanh: HANH[STAR_HANH[s.name]] || null, bright: b, amDuong: CHINH_AM_DUONG[s.name] || null,
          kind: CHINH_TINH.includes(s.name) ? 'chinh' : (HUNG.has(s.name) ? 'hung' : 'cat'),
          hoa: hoaOf[s.name] || null };
      }).sort((a, b) => (a.kind === 'chinh' && b.kind === 'chinh')
        ? CHINH_TINH.indexOf(a.name) - CHINH_TINH.indexOf(b.name)
        : (ORDER_IDX[a.name] ?? 999) - (ORDER_IDX[b.name] ?? 999));
      return {
        chi: p, chiTen: CHI[p], can: canCung(p), canTen: CAN[canCung(p)], hanh: CUNG_HANH[p], amDuong: p % 2 === 0 ? 1 : -1,
        cung: CUNG[mod(12 - offset) % 12] === undefined ? '' : CUNG[(12 - offset) % 12],
        isThan: p === than, daiHan, daiHanEnd: daiHan + 9,
        tieuHanChi: tieuHanChi[p], tieuHanTen: CHI[tieuHanChi[p]],
        trangSinh: trangSinh[p], luuNguyet: luuNguyet[p],
        tuan: tuan.includes(p), triet: triet.includes(p),
        stars: list,
      };
    });
    // Tên cung: Mệnh, rồi Phụ Mẫu ở cung kế thuận, Phúc Đức... (12 cung xếp thuận chiều kim đồng hồ từ Mệnh là Mệnh, Phụ Mẫu, ...)
    palaces.forEach((pl) => { pl.cung = CUNG[mod(pl.chi - menh)]; });

    const daiHanHienTai = palaces.find((pl) => tuoi >= pl.daiHan && tuoi <= pl.daiHanEnd) || null;

    // Lưu niên năm xem
    const ltX = LOC_TON[xem.can];
    const luu = Array.from({ length: 12 }, () => []);
    const putL = (p, n) => luu[mod(p)].push(n);
    putL(xem.chi, 'L.Thái Tuế'); putL(xem.chi + 2, 'L.Tang Môn'); putL(xem.chi + 8, 'L.Bạch Hổ');
    putL(6 + xem.chi, 'L.Thiên Hư'); putL(6 - xem.chi, 'L.Thiên Khốc');
    putL(ltX, 'L.Lộc Tồn'); putL(ltX + 1, 'L.Kình Dương'); putL(ltX - 1, 'L.Đà La');
    putL([2, 11, 8, 5][xem.chi % 4], 'L.Thiên Mã');
    TU_HOA[xem.can].forEach((star, i) => putL(pos[star], 'L.' + HOA[i]));
    palaces.forEach((pl, p) => { pl.luuNien = luu[p]; });

    const menhChu = opt.menhChu === 'cungMenh' ? MENH_CHU[menh] : MENH_CHU[z];
    const thanChu = THAN_CHU[z];
    const menhDuong = menh % 2 === 0;
    const amDuongLy = (menhDuong === duongNam) ? 'Âm dương thuận lý' : 'Âm dương nghịch lý';

    // Lai nhân cung: cung (trừ Tý, Sửu) có can trùng can năm sinh
    const laiNhanChi = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11].find((p) => canCung(p) === c);
    const canXuong = CX_NAM[giapTy(c, z)] + CX_THANG[(m - 1) % 12] + CX_NGAY[Math.min(d, 30) - 1] + CX_GIO[h];

    return {
      input: { ...input, options: opt },
      thienBan: {
        name: input.name || '',
        gender: male ? 'Nam' : 'Nữ',
        amDuong: (duongNam ? 'Dương' : 'Âm') + (male ? ' Nam' : ' Nữ'),
        duongLich: { day: solarAdj.day, month: solarAdj.month, year: solarAdj.year, hour: Math.floor(minutes / 60), minute: minutes % 60 },
        amLich: { day: lunar.day, month: lunar.month, year: lunar.year, leap: lunar.leap, monthAn: m },
        canChi: { nam: CAN[c] + ' ' + CHI[z], thang: L.name(mcc), ngay: L.name(dcc), gio: L.name(hcc) },
        gioChi: CHI[h], gioTyMuon: lateTy,
        banMenh: banMenh.ten, hanhMenh: banMenh.hanh,
        cuc, cucTen: CUC_TEN[cuc], quanHeMenhCuc: quanHe(banMenh.hanh, menhNA.hanh),
        amDuongLy, menhChu, thanChu,
        menhCung: menh, thanCung: than, thanCu: CUNG[mod(than - menh)],
        namXem, namXemCanChi: CAN[xem.can] + ' ' + CHI[xem.chi], tuoi,
        tieuHanCung: tieuHanPalace, daiHanCung: daiHanHienTai ? daiHanHienTai.chi : null,
        thuanNghich: ad === 1 ? 'thuận' : 'nghịch',
        banMenhNghia: banMenh.nghia, hanhCuc: menhNA.hanh,
        laiNhan: laiNhanChi === undefined ? null : CUNG[mod(laiNhanChi - menh)], laiNhanChi: laiNhanChi === undefined ? null : laiNhanChi,
        canXuong, canXuongTen: `${Math.floor(canXuong / 10)} lượng${canXuong % 10 ? ' ' + (canXuong % 10) + ' chỉ' : ''}`,
        tuan, triet,
      },
      palaces,
    };
  }

  return { compute, DEFAULT_OPTIONS, CUNG, CHINH_TINH, CAN, CHI };
})();

if (typeof module !== 'undefined') module.exports = TuViEngine;
