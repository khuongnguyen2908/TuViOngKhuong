// Bản đồ sao (chiêm tinh phương Tây): vị trí Mặt Trời, Mặt Trăng, 8 hành tinh, Nút Bắc, Điểm Mọc, Thiên Đỉnh,
// 12 nhà Placidus và góc chiếu. Công thức tự viết, không dùng thư viện ngoài:
//   Mặt Trời: lunar.js (Meeus); Mặt Trăng: Meeus chương 47 (59 số hạng); Sao Thủy → Hải Vương: phần tử quỹ đạo
//   và nhiễu Mộc – Thổ – Thiên Vương của Paul Schlyter; Diêm Vương: phần tử JPL "Approximate Positions of the Planets".
// Đối chiếu với một lá số tính bằng Swiss Ephemeris: lệch dưới 1,5 phút cung.
const TuViBanDoSao = (() => {
  const L = (typeof LunarVN !== 'undefined') ? LunarVN : require('./lunar.js');
  const RAD = Math.PI / 180;
  const n360 = (x) => ((x % 360) + 360) % 360;
  const sin = (x) => Math.sin(x * RAD), cos = (x) => Math.cos(x * RAD);
  const kc = (a, b) => Math.abs(((a - b + 540) % 360) - 180); // khoảng cách góc 0..180

  const CUNG = ['Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ', 'Thiên Bình', 'Bọ Cạp', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'];
  const KY_CUNG = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  const NGUYEN_TO = ['Lửa', 'Đất', 'Khí', 'Nước']; // theo cung: Bạch Dương Lửa, Kim Ngưu Đất, Song Tử Khí, Cự Giải Nước, lặp lại
  const THE = ['Thống lĩnh', 'Cố định', 'Biến đổi'];
  const SAO = [
    ['sun', 'Mặt Trời', '☉'], ['moon', 'Mặt Trăng', '☽'], ['mercury', 'Sao Thủy', '☿'], ['venus', 'Sao Kim', '♀'], ['mars', 'Sao Hỏa', '♂'],
    ['jupiter', 'Sao Mộc', '♃'], ['saturn', 'Sao Thổ', '♄'], ['uranus', 'Thiên Vương', '♅'], ['neptune', 'Hải Vương', '♆'], ['pluto', 'Diêm Vương', '♇'],
    ['node', 'Nút Bắc', '☊'],
  ];
  // Chủ tinh cai quản từng cung (hiện đại)
  const CHU_TINH = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'pluto', 'jupiter', 'saturn', 'uranus', 'neptune'];
  // Đắc địa (nhà riêng), Vượng địa (thăng hoa), Hãm địa (đối nhà riêng), Tuyệt địa (đối thăng hoa)
  const PHAM = {
    sun: [[4], [0], [10], [6]], moon: [[3], [1], [9], [7]], mercury: [[2, 5], [], [8, 11], [11]], venus: [[1, 6], [11], [7, 0], [5]],
    mars: [[0, 7], [9], [6, 1], [3]], jupiter: [[8, 11], [3], [2, 5], [9]], saturn: [[9, 10], [6], [3, 4], [0]],
    uranus: [[10], [7], [4], [1]], neptune: [[11], [3], [5], [9]], pluto: [[7], [], [1], []],
  };
  const PHAM_TEN = ['Đắc địa', 'Vượng địa', 'Hãm địa', 'Tuyệt địa'];
  const GOC = [
    ['trung', 'Trùng tụ', '☌', 0, 8], ['luc', 'Lục hợp', '⚹', 60, 5], ['vuong', 'Vuông góc', '□', 90, 7],
    ['tam', 'Tam hợp', '△', 120, 7], ['xung', 'Đối đỉnh', '☍', 180, 8],
  ];

  // ---------- Vị trí ----------
  function kepler(M, e) {
    let E = M + (e / RAD) * sin(M);
    for (let i = 0; i < 30; i++) E -= (E - (e / RAD) * sin(E) - M) / (1 - e * cos(E));
    return E;
  }
  // Schlyter: N, i, w, a, e, M (độ, AU) và tốc độ mỗi ngày; d = số ngày từ 2000-01-00.0 TT; quy về điểm xuân phân của ngày
  const SCH = {
    mercury: [48.3313, 3.24587e-5, 7.0047, 5.0e-8, 29.1241, 1.01444e-5, 0.387098, 0, 0.205635, 5.59e-10, 168.6562, 4.0923344368],
    venus: [76.6799, 2.4659e-5, 3.3946, 2.75e-8, 54.891, 1.38374e-5, 0.72333, 0, 0.006773, -1.302e-9, 48.0052, 1.6021302244],
    mars: [49.5574, 2.11081e-5, 1.8497, -1.78e-8, 286.5016, 2.92961e-5, 1.523688, 0, 0.093405, 2.516e-9, 18.6021, 0.5240207766],
    jupiter: [100.4542, 2.76854e-5, 1.303, -1.557e-7, 273.8777, 1.64505e-5, 5.20256, 0, 0.048498, 4.469e-9, 19.895, 0.0830853001],
    saturn: [113.6634, 2.3898e-5, 2.4886, -1.081e-7, 339.3939, 2.97661e-5, 9.55475, 0, 0.055546, -9.499e-9, 316.967, 0.0334442282],
    uranus: [74.0005, 1.3978e-5, 0.7733, 1.9e-8, 96.6612, 3.0565e-5, 19.18171, -1.55e-8, 0.047318, 7.45e-9, 142.5905, 0.011725806],
    neptune: [131.7806, 3.0173e-5, 1.77, -2.55e-7, 272.8461, -6.027e-6, 30.05826, 3.313e-8, 0.008606, 2.15e-9, 260.2471, 0.005995147],
  };
  const mAnom = (p, d) => n360(SCH[p][10] + SCH[p][11] * d);
  function nhatTam(p, d) {
    const k = SCH[p], N = k[0] + k[1] * d, i = k[2] + k[3] * d, w = k[4] + k[5] * d, a = k[6] + k[7] * d, e = k[8] + k[9] * d;
    const E = kepler(mAnom(p, d), e), xv = a * (cos(E) - e), yv = a * Math.sqrt(1 - e * e) * sin(E);
    const v = Math.atan2(yv, xv) / RAD, r = Math.hypot(xv, yv);
    let lon = Math.atan2(sin(N) * cos(v + w) + cos(N) * sin(v + w) * cos(i), cos(N) * cos(v + w) - sin(N) * sin(v + w) * cos(i)) / RAD;
    let lat = Math.asin(sin(v + w) * sin(i)) / RAD;
    const Mj = mAnom('jupiter', d), Ms = mAnom('saturn', d), Mu = mAnom('uranus', d);
    if (p === 'jupiter') lon += -0.332 * sin(2 * Mj - 5 * Ms - 67.6) - 0.056 * sin(2 * Mj - 2 * Ms + 21) + 0.042 * sin(3 * Mj - 5 * Ms + 21) - 0.036 * sin(Mj - 2 * Ms) + 0.022 * cos(Mj - Ms) + 0.023 * sin(2 * Mj - 3 * Ms + 52) - 0.016 * sin(Mj - 5 * Ms - 69);
    if (p === 'saturn') {
      lon += 0.812 * sin(2 * Mj - 5 * Ms - 67.6) - 0.229 * cos(2 * Mj - 4 * Ms - 2) + 0.119 * sin(Mj - 2 * Ms - 3) + 0.046 * sin(2 * Mj - 6 * Ms - 69) + 0.014 * sin(Mj - 3 * Ms + 32);
      lat += -0.02 * cos(2 * Mj - 4 * Ms - 2) + 0.018 * sin(2 * Mj - 6 * Ms - 49);
    }
    if (p === 'uranus') lon += 0.04 * sin(Ms - 2 * Mu + 6) + 0.035 * sin(Ms - 3 * Mu + 33) - 0.015 * sin(Mj - Mu + 20);
    return [r * cos(lon) * cos(lat), r * sin(lon) * cos(lat), r * sin(lat)];
  }
  function traiDat(d) { // vị trí Trái Đất nhìn từ Mặt Trời = ngược hướng Mặt Trời
    const w = 282.9404 + 4.70935e-5 * d, e = 0.016709 - 1.151e-9 * d, E = kepler(n360(356.047 + 0.9856002585 * d), e);
    const xv = cos(E) - e, yv = Math.sqrt(1 - e * e) * sin(E), lon = Math.atan2(yv, xv) / RAD + w, r = Math.hypot(xv, yv);
    return [-r * cos(lon), -r * sin(lon), 0];
  }
  // Diêm Vương: phần tử JPL (mặt hoàng đạo J2000), cộng tuế sai để về điểm xuân phân của ngày
  function dvNhatTam(T) {
    const a = 39.48211675 - 0.00031596 * T, e = 0.2488273 + 0.0000517 * T, I = 17.14001206 + 0.00004818 * T;
    const Lm = 238.92903833 + 145.20780515 * T, wb = 224.06891629 - 0.04062942 * T, O = 110.30393684 - 0.01183482 * T;
    const w = wb - O, E = kepler(n360(Lm - wb), e), xp = a * (cos(E) - e), yp = a * Math.sqrt(1 - e * e) * sin(E);
    const x = (cos(w) * cos(O) - sin(w) * sin(O) * cos(I)) * xp + (-sin(w) * cos(O) - cos(w) * sin(O) * cos(I)) * yp;
    const y = (cos(w) * sin(O) + sin(w) * cos(O) * cos(I)) * xp + (-sin(w) * sin(O) + cos(w) * cos(O) * cos(I)) * yp;
    const z = sin(w) * sin(I) * xp + cos(w) * sin(I) * yp;
    const lon = Math.atan2(y, x) / RAD + 1.3969713 * T, r = Math.hypot(x, y);
    return [r * cos(lon), r * sin(lon), z];
  }
  // Kinh độ hoàng đạo địa tâm của hành tinh (độ), có hiệu chỉnh thời gian ánh sáng
  function hanhTinh(p, jdTT) {
    const d0 = jdTT - 2451543.5;
    let d = d0;
    for (let k = 0; k < 2; k++) {
      const P = p === 'pluto' ? dvNhatTam((d - 1.5) / 36525) : nhatTam(p, d), Ed = traiDat(d0);
      const v = [P[0] - Ed[0], P[1] - Ed[1], P[2] - Ed[2]];
      if (k === 1) return n360(Math.atan2(v[1], v[0]) / RAD);
      d = d0 - Math.hypot(...v) * 0.0057755183;
    }
  }
  // Mặt Trăng: Meeus 47 (các số hạng lớn nhất của ΣL, đơn vị 1e-6 độ)
  const TRANG = [[0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720], [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528], [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888], [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036], [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390], [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773], [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110], [3, 0, -1, 0, -892], [2, 1, 1, 0, -810], [4, -1, -2, 0, 759], [0, 2, -1, 0, -713], [2, 2, -1, 0, -700], [2, 1, -2, 0, 691], [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537], [4, -1, 0, 0, 520], [1, 0, -2, 0, -487], [2, 1, 0, -2, -399], [0, 0, 2, -2, -381], [1, 1, 1, 0, 351], [3, 0, -2, 0, -340], [4, 0, -3, 0, 330], [2, -1, 2, 0, 327], [0, 2, 1, 0, -323], [1, 1, -1, 0, 299], [2, 0, 3, 0, 294]];
  function doiSoTrang(T) {
    return {
      Lp: 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T, D: 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T,
      M: 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T, Mp: 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T,
      F: 93.272095 + 483202.0175233 * T - 0.0036539 * T * T, E: 1 - 0.002516 * T - 0.0000074 * T * T,
    };
  }
  function matTrang(T) {
    const { Lp, D, M, Mp, F, E } = doiSoTrang(T);
    let s = 0;
    for (const [d, m, mp, f, c] of TRANG) s += c * (Math.abs(m) === 1 ? E : m ? E * E : 1) * sin(d * D + m * M + mp * Mp + f * F);
    s += 3958 * sin(119.75 + 131.849 * T) + 1962 * sin(Lp - F) + 318 * sin(53.09 + 479264.29 * T);
    const om = 125.04452 - 1934.136261 * T, dpsi = (-17.2 * sin(om) - 1.32 * sin(2 * (280.4665 + 36000.7698 * T))) / 3600;
    return n360(Lp + s / 1e6 + dpsi);
  }
  function nutBac(T) { // nút thật (Meeus 47)
    const { D, M, Mp, F } = doiSoTrang(T);
    const tb = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T;
    return n360(tb - 1.4979 * sin(2 * (D - F)) - 0.15 * sin(M) - 0.1226 * sin(2 * D) + 0.1176 * sin(2 * F) - 0.0801 * sin(2 * (Mp - F)));
  }
  function viTri(key, jdUT) {
    const tt = jdUT + L.deltaT(2000 + (jdUT - 2451545) / 365.25) / 86400, T = (tt - 2451545) / 36525;
    if (key === 'sun') return L.sunLongitude(jdUT);
    if (key === 'moon') return matTrang(T);
    if (key === 'node') return nutBac(T);
    return hanhTinh(key, tt);
  }

  // ---------- Điểm Mọc, Thiên Đỉnh, nhà Placidus ----------
  const ramcOf = (jdUT, kinhDo) => {
    const T = (jdUT - 2451545) / 36525;
    return n360(280.46061837 + 360.98564736629 * (jdUT - 2451545) + 0.000387933 * T * T + kinhDo);
  };
  const xichKinh = (lam, eps) => n360(Math.atan2(sin(lam) * cos(eps), cos(lam)) / RAD); // xích kinh của điểm trên hoàng đạo
  const tuXichKinh = (ra, eps) => n360(Math.atan2(sin(ra), cos(ra) * cos(eps)) / RAD); // điểm hoàng đạo có xích kinh ra
  function nha(jdUT, viDo, kinhDo) {
    const T = (jdUT - 2451545) / 36525, eps = 23.4392911 - 0.0130042 * T, ramc = ramcOf(jdUT, kinhDo);
    const mc = tuXichKinh(ramc, eps);
    const asc = n360(Math.atan2(cos(ramc), -(sin(ramc) * cos(eps) + Math.tan(viDo * RAD) * sin(eps))) / RAD);
    // Placidus: tìm điểm hoàng đạo chia cung bán nhật (bán dạ) thành 3 phần
    const cusp = (phan, duoi) => {
      let ra = ramc + (duoi ? 180 - phan * 90 : phan * 90);
      for (let k = 0; k < 40; k++) {
        const dec = Math.asin(sin(eps) * sin(tuXichKinh(ra, eps))) / RAD;
        const x = -Math.tan(viDo * RAD) * Math.tan(dec * RAD);
        const dsa = Math.abs(x) >= 1 ? (x > 0 ? 180 : 0) : Math.acos(x) / RAD; // cung bán nhật
        const moi = duoi ? ramc + 180 - phan * (180 - dsa) : ramc + phan * dsa;
        if (Math.abs(moi - ra) < 1e-7) break;
        ra = moi;
      }
      return tuXichKinh(ra, eps);
    };
    const c = new Array(12);
    c[0] = asc; c[9] = mc;
    c[10] = cusp(1 / 3, false); c[11] = cusp(2 / 3, false); c[1] = cusp(2 / 3, true); c[2] = cusp(1 / 3, true);
    [3, 4, 5, 6, 7, 8].forEach((i) => { c[i] = n360(c[(i + 6) % 12] + 180); });
    return { asc, mc, cusps: c, eps, ramc };
  }
  const nhaCua = (lam, cusps) => {
    for (let i = 0; i < 12; i++) {
      const a = cusps[i], b = cusps[(i + 1) % 12];
      if (n360(lam - a) < n360(b - a)) return i + 1;
    }
    return 1;
  };

  // ---------- Nơi sinh: 63 tỉnh, thành (tọa độ trung tâm tỉnh lỵ, tên trước sáp nhập 2025) ----------
  const NOI = [
    ['ha-noi', 'Hà Nội', 21.03, 105.85], ['tp-hcm', 'TP Hồ Chí Minh', 10.78, 106.7], ['hai-phong', 'Hải Phòng', 20.86, 106.68], ['da-nang', 'Đà Nẵng', 16.05, 108.22], ['can-tho', 'Cần Thơ', 10.03, 105.78],
    ['an-giang', 'An Giang', 10.39, 105.44], ['ba-ria-vung-tau', 'Bà Rịa – Vũng Tàu', 10.5, 107.17], ['bac-giang', 'Bắc Giang', 21.27, 106.19], ['bac-kan', 'Bắc Kạn', 22.15, 105.83], ['bac-lieu', 'Bạc Liêu', 9.29, 105.72],
    ['bac-ninh', 'Bắc Ninh', 21.18, 106.07], ['ben-tre', 'Bến Tre', 10.24, 106.38], ['binh-dinh', 'Bình Định', 13.78, 109.22], ['binh-duong', 'Bình Dương', 10.98, 106.65], ['binh-phuoc', 'Bình Phước', 11.54, 106.89],
    ['binh-thuan', 'Bình Thuận', 10.93, 108.1], ['ca-mau', 'Cà Mau', 9.18, 105.15], ['cao-bang', 'Cao Bằng', 22.67, 106.26], ['dak-lak', 'Đắk Lắk', 12.67, 108.04], ['dak-nong', 'Đắk Nông', 12.0, 107.69],
    ['dien-bien', 'Điện Biên', 21.39, 103.02], ['dong-nai', 'Đồng Nai', 10.95, 106.82], ['dong-thap', 'Đồng Tháp', 10.46, 105.63], ['gia-lai', 'Gia Lai', 13.98, 108.0], ['ha-giang', 'Hà Giang', 22.82, 104.98],
    ['ha-nam', 'Hà Nam', 20.54, 105.91], ['ha-tinh', 'Hà Tĩnh', 18.34, 105.91], ['hai-duong', 'Hải Dương', 20.94, 106.33], ['hau-giang', 'Hậu Giang', 9.78, 105.47], ['hoa-binh', 'Hòa Bình', 20.82, 105.34],
    ['hung-yen', 'Hưng Yên', 20.65, 106.05], ['khanh-hoa', 'Khánh Hòa', 12.24, 109.19], ['kien-giang', 'Kiên Giang', 10.01, 105.08], ['kon-tum', 'Kon Tum', 14.35, 108.0], ['lai-chau', 'Lai Châu', 22.39, 103.46],
    ['lam-dong', 'Lâm Đồng', 11.94, 108.44], ['lang-son', 'Lạng Sơn', 21.85, 106.76], ['lao-cai', 'Lào Cai', 22.48, 103.97], ['long-an', 'Long An', 10.54, 106.41], ['nam-dinh', 'Nam Định', 20.43, 106.17],
    ['nghe-an', 'Nghệ An', 18.68, 105.68], ['ninh-binh', 'Ninh Bình', 20.25, 105.97], ['ninh-thuan', 'Ninh Thuận', 11.56, 108.99], ['phu-tho', 'Phú Thọ', 21.32, 105.4], ['phu-yen', 'Phú Yên', 13.1, 109.3],
    ['quang-binh', 'Quảng Bình', 17.47, 106.62], ['quang-nam', 'Quảng Nam', 15.57, 108.47], ['quang-ngai', 'Quảng Ngãi', 15.12, 108.8], ['quang-ninh', 'Quảng Ninh', 20.95, 107.08], ['quang-tri', 'Quảng Trị', 16.82, 107.1],
    ['soc-trang', 'Sóc Trăng', 9.6, 105.97], ['son-la', 'Sơn La', 21.33, 103.91], ['tay-ninh', 'Tây Ninh', 11.31, 106.1], ['thai-binh', 'Thái Bình', 20.45, 106.34], ['thai-nguyen', 'Thái Nguyên', 21.59, 105.85],
    ['thanh-hoa', 'Thanh Hóa', 19.81, 105.78], ['hue', 'Thừa Thiên Huế', 16.46, 107.6], ['tien-giang', 'Tiền Giang', 10.36, 106.36], ['tra-vinh', 'Trà Vinh', 9.93, 106.35], ['tuyen-quang', 'Tuyên Quang', 21.82, 105.21],
    ['vinh-long', 'Vĩnh Long', 10.25, 105.97], ['vinh-phuc', 'Vĩnh Phúc', 21.31, 105.6], ['yen-bai', 'Yên Bái', 21.72, 104.91],
  ];

  // ---------- Lập bản đồ ----------
  // input: { day, month, year, calendar, leap, hour, minute, noHour, clockTz (múi giờ đồng hồ lúc sinh), viDo, kinhDo, noiSinh }
  function compute(input) {
    const cal = L.makeCalendar(7);
    let j;
    if (input.calendar === 'am') {
      const s = cal.lunarToSolar(input.day, input.month, input.year, !!input.leap);
      if (!s) throw new Error('Ngày âm lịch không tồn tại (kiểm tra tháng nhuận hoặc ngày 30).');
      j = s.jdn;
    } else {
      j = L.jdn(input.day, input.month, input.year);
      const chk = L.fromJdn(j);
      if (chk.day !== input.day || chk.month !== input.month) throw new Error('Ngày dương lịch không tồn tại.');
    }
    const noHour = !!input.noHour, tz = Number.isFinite(input.clockTz) ? input.clockTz : 7;
    const phut = noHour ? 720 : (input.hour || 0) * 60 + (input.minute || 0);
    const jdUT = j - 0.5 + phut / 1440 - tz / 24;
    const viDo = input.viDo, kinhDo = input.kinhDo;
    const h = noHour ? null : nha(jdUT, viDo, kinhDo);

    const cungOf = (lam) => Math.floor(n360(lam) / 30);
    const diem = (key, ten, ky, lam, toc) => {
      const c = cungOf(lam), pham = PHAM[key] ? PHAM[key].findIndex((ds) => ds.includes(c)) : -1;
      return { key, ten, ky, lam, cung: c, cungTen: CUNG[c], do: n360(lam) - c * 30, nghich: toc !== null && toc < 0,
        nha: h ? nhaCua(lam, h.cusps) : null, pham: pham >= 0 ? PHAM_TEN[pham] : null };
    };
    const sao = SAO.map(([key, ten, ky]) => {
      const lam = viTri(key, jdUT);
      const toc = key === 'sun' || key === 'moon' ? null : ((viTri(key, jdUT + 0.5) - viTri(key, jdUT - 0.5) + 540) % 360) - 180;
      return diem(key, ten, ky, lam, toc);
    });
    const goc = [];
    const chinh = sao.filter((s) => s.key !== 'node');
    for (let a = 0; a < chinh.length; a++) {
      for (let b = a + 1; b < chinh.length; b++) {
        const x = chinh[a], y = chinh[b], dist = kc(x.lam, y.lam);
        const den = (x.key === 'sun' || x.key === 'moon' || y.key === 'sun' || y.key === 'moon') ? 2 : 0; // hai vầng sáng được nới orb
        for (const [k, ten, ky, deg, orb] of GOC) {
          if (Math.abs(dist - deg) <= orb + den) { goc.push({ a: x.key, b: y.key, loai: k, ten, ky, lech: Math.round(Math.abs(dist - deg) * 10) / 10 }); break; }
        }
      }
    }
    // Cân bằng nguyên tố, thể (Mặt Trời → Diêm Vương, cộng Điểm Mọc nếu có)
    const dem = { nguyenTo: [0, 0, 0, 0], the: [0, 0, 0] };
    const tinh = [...chinh.map((s) => s.cung), ...(h ? [cungOf(h.asc)] : [])];
    tinh.forEach((c) => { dem.nguyenTo[c % 4]++; dem.the[c % 3]++; });
    const solar = L.fromJdn(j);
    return {
      input, ten: input.name || '', gioiTinh: input.gender === 'nu' ? 'Nữ' : 'Nam', noHour, tz,
      duongLich: { day: solar.day, month: solar.month, year: solar.year, hour: Math.floor(phut / 60), minute: phut % 60 },
      noiSinh: input.noiSinh || '', viDo, kinhDo, jdUT,
      sao, goc, dem,
      moc: h ? diem('asc', 'Điểm Mọc', 'AC', h.asc, null) : null,
      dinh: h ? diem('mc', 'Thiên Đỉnh', 'MC', h.mc, null) : null,
      nhaDinh: h ? h.cusps.map((lam, i) => ({ so: i + 1, lam, cung: cungOf(lam), cungTen: CUNG[cungOf(lam)], do: n360(lam) - cungOf(lam) * 30 })) : null,
      chuTinhMoc: h ? CHU_TINH[cungOf(h.asc)] : null,
    };
  }

  const doPhut = (x) => { const d = Math.floor(x), m = Math.floor((x - d) * 60), s = Math.round(((x - d) * 60 - m) * 60); return `${d}°${String(m).padStart(2, '0')}'${String(s === 60 ? 59 : s).padStart(2, '0')}"`; };

  return { compute, viTri, nha, nhaCua, doPhut, CUNG, KY_CUNG, NGUYEN_TO, THE, SAO, CHU_TINH, GOC, NOI, PHAM_TEN };
})();
if (typeof module !== 'undefined') module.exports = TuViBanDoSao;
