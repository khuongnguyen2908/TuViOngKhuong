// Âm lịch Việt Nam — tính thiên văn theo công thức trong "Astronomical Algorithms" (Jean Meeus).
// Quy tắc: tháng bắt đầu ở ngày có điểm sóc (giờ địa phương), Đông chí luôn thuộc tháng 11,
// năm 13 tháng thì tháng nhuận là tháng đầu tiên sau tháng 11 không chứa trung khí.
// Viết mới cho dự án này; mặc định múi giờ UTC+7.

const LunarVN = (() => {
  const RAD = Math.PI / 180;
  const sinD = (x) => Math.sin(x * RAD);
  const norm360 = (x) => ((x % 360) + 360) % 360;

  // Số ngày Julius (JDN) của ngày dương lịch, lịch Gregory từ 15/10/1582
  function jdn(d, m, y) {
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    let j = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - 32083;
    if (j - Math.floor(yy / 100) + Math.floor(yy / 400) + 38 >= 2299161) {
      j = j - Math.floor(yy / 100) + Math.floor(yy / 400) + 38;
    }
    return j;
  }

  function fromJdn(j) {
    let a, b, c;
    if (j >= 2299161) {
      a = j + 32044;
      b = Math.floor((4 * a + 3) / 146097);
      c = a - Math.floor((146097 * b) / 4);
    } else {
      b = 0;
      c = j + 32082;
    }
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);
    return {
      day: e - Math.floor((153 * m + 2) / 5) + 1,
      month: m + 3 - 12 * Math.floor(m / 10),
      year: b * 100 + d - 4800 + Math.floor(m / 10),
    };
  }

  // ΔT (giây), đa thức Espenak–Meeus
  function deltaT(y) {
    let t;
    if (y < 1800) { const u = (y - 1820) / 100; return -20 + 32 * u * u; }
    if (y < 1860) { t = y - 1800; return 13.72 - 0.332447 * t + 0.0068612 * t ** 2 + 0.0041116 * t ** 3 - 0.00037436 * t ** 4 + 0.0000121272 * t ** 5 - 0.0000001699 * t ** 6 + 0.000000000875 * t ** 7; }
    if (y < 1900) { t = y - 1860; return 7.62 + 0.5737 * t - 0.251754 * t ** 2 + 0.01680668 * t ** 3 - 0.0004473624 * t ** 4 + t ** 5 / 233174; }
    if (y < 1920) { t = y - 1900; return -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4; }
    if (y < 1941) { t = y - 1920; return 21.2 + 0.84493 * t - 0.0761 * t ** 2 + 0.0020936 * t ** 3; }
    if (y < 1961) { t = y - 1950; return 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547; }
    if (y < 1986) { t = y - 1975; return 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718; }
    if (y < 2005) { t = y - 2000; return 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5; }
    if (y < 2050) { t = y - 2000; return 62.92 + 0.32217 * t + 0.005589 * t ** 2; }
    if (y < 2150) { const u = (y - 1820) / 100; return -20 + 32 * u * u - 0.5628 * (2150 - y); }
    const u = (y - 1820) / 100; return -20 + 32 * u * u;
  }
  const yearOfJd = (jd) => 2000 + (jd - 2451545) / 365.25;

  // Thời điểm sóc thứ k (k = 0 quanh 06/01/2000), trả về JD theo UT
  function newMoonUT(k) {
    const T = k / 1236.85;
    let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T - 0.00000015 * T ** 3 + 0.00000000073 * T ** 4;
    const E = 1 - 0.002516 * T - 0.0000074 * T * T;
    const M = 2.5534 + 29.1053567 * k - 0.0000014 * T * T - 0.00000011 * T ** 3;
    const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T ** 3 - 0.000000058 * T ** 4;
    const F = 160.7108 + 390.67050284 * k - 0.0016118 * T * T - 0.00000227 * T ** 3 + 0.000000011 * T ** 4;
    const Om = 124.7746 - 1.56375588 * k + 0.0020672 * T * T + 0.00000215 * T ** 3;
    jde += -0.4072 * sinD(Mp) + 0.17241 * E * sinD(M) + 0.01608 * sinD(2 * Mp) + 0.01039 * sinD(2 * F)
      + 0.00739 * E * sinD(Mp - M) - 0.00514 * E * sinD(Mp + M) + 0.00208 * E * E * sinD(2 * M)
      - 0.00111 * sinD(Mp - 2 * F) - 0.00057 * sinD(Mp + 2 * F) + 0.00056 * E * sinD(2 * Mp + M)
      - 0.00042 * sinD(3 * Mp) + 0.00042 * E * sinD(M + 2 * F) + 0.00038 * E * sinD(M - 2 * F)
      - 0.00024 * E * sinD(2 * Mp - M) - 0.00017 * sinD(Om) - 0.00007 * sinD(Mp + 2 * M)
      + 0.00004 * sinD(2 * Mp - 2 * F) + 0.00004 * sinD(3 * M) + 0.00003 * sinD(Mp + M - 2 * F)
      + 0.00003 * sinD(2 * Mp + 2 * F) - 0.00003 * sinD(Mp + M + 2 * F) + 0.00003 * sinD(Mp - M + 2 * F)
      - 0.00002 * sinD(Mp - M - 2 * F) - 0.00002 * sinD(3 * Mp + M) + 0.00002 * sinD(4 * Mp);
    const A = [
      [299.77, 0.107408, 0.000325], [251.88, 0.016321, 0.000165], [251.83, 26.651886, 0.000164],
      [349.42, 36.412478, 0.000126], [84.66, 18.206239, 0.00011], [141.74, 53.303771, 0.000062],
      [207.14, 2.453732, 0.00006], [154.84, 7.30686, 0.000056], [34.52, 27.261239, 0.000047],
      [207.19, 0.121824, 0.000042], [291.34, 1.844379, 0.00004], [161.72, 24.198154, 0.000037],
      [239.56, 25.513099, 0.000035], [331.55, 3.592518, 0.000023],
    ];
    A.forEach(([a, b, c], i) => {
      const arg = a + b * k + (i === 0 ? -0.009173 * T * T : 0);
      jde += c * sinD(arg);
    });
    return jde - deltaT(yearOfJd(jde)) / 86400;
  }

  // Kinh độ biểu kiến của Mặt Trời (độ) tại thời điểm JD theo UT
  function sunLongitude(jdUT) {
    const jd = jdUT + deltaT(yearOfJd(jdUT)) / 86400;
    const T = (jd - 2451545) / 36525;
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinD(M) + (0.019993 - 0.000101 * T) * sinD(2 * M) + 0.000289 * sinD(3 * M);
    const om = 125.04 - 1934.136 * T;
    return norm360(L0 + C - 0.00569 - 0.00478 * sinD(om));
  }

  // Ngày bắt đầu tháng (JDN) mà sóc tính ra rơi vào 23:58–24:00 giờ Hà Nội;
  // lịch Việt Nam thông dụng đặt mùng 1 vào ngày hôm sau.
  const HND_COMPAT = new Set([[20, 6, 1944], [7, 7, 1967], [9, 12, 2072], [15, 11, 2077], [7, 5, 2130],
    [26, 5, 2150], [17, 5, 2159], [22, 1, 2175], [26, 1, 2199]].map(([d, m, y]) => jdn(d, m, y)));

  function makeCalendar(tz = 7) {
    const cache = new Map();
    const monthStart = (k) => {
      if (!cache.has(k)) {
        let d = Math.floor(newMoonUT(k) + 0.5 + tz / 24);
        // Sóc rơi sát nửa đêm (sai khác < 2 phút): theo ngày mà lịch Việt Nam phổ biến đang in
        if (tz === 7 && HND_COMPAT.has(d)) d += 1;
        cache.set(k, d);
      }
      return cache.get(k);
    };
    // Chỉ số trung khí (0..11, mỗi 30°) tại đầu ngày địa phương có JDN = d
    const majorTerm = (d) => Math.floor(sunLongitude(d - 0.5 - tz / 24) / 30);
    // Tháng âm (chỉ số k) chứa ngày d
    function monthIndexOf(d) {
      let k = Math.floor((d - 2451550.1) / 29.530588853);
      while (monthStart(k) > d) k--;
      while (monthStart(k + 1) <= d) k++;
      return k;
    }
    const m11Cache = new Map();
    // Chỉ số k của tháng 11 âm chứa Đông chí của năm dương lịch Y
    function month11(Y) {
      if (m11Cache.has(Y)) return m11Cache.get(Y);
      let k = monthIndexOf(jdn(31, 12, Y));
      if (majorTerm(monthStart(k)) >= 9) k -= 1;
      m11Cache.set(Y, k);
      return k;
    }
    function leapOffset(a11) {
      for (let i = 1; i <= 12; i++) {
        if (majorTerm(monthStart(a11 + i)) === majorTerm(monthStart(a11 + i + 1))) return i;
      }
      return 13;
    }

    function solarToLunar(d, m, y) {
      const day = jdn(d, m, y);
      const k = monthIndexOf(day);
      let a11 = month11(y - 1), b11 = month11(y);
      let lunarYear = y;
      if (monthStart(b11) <= day) { a11 = b11; b11 = month11(y + 1); lunarYear = y + 1; }
      const diff = k - a11;
      let leap = false;
      let mIdx = diff;
      if (b11 - a11 > 12) {
        const lo = leapOffset(a11);
        if (diff >= lo) {
          mIdx = diff - 1;
          if (diff === lo) leap = true;
        }
      }
      let month = ((10 + mIdx) % 12) + 1;
      if (month >= 11 && mIdx < 2) lunarYear -= 1;
      return { day: day - monthStart(k) + 1, month, year: lunarYear, leap, jdn: day,
        monthDays: monthStart(k + 1) - monthStart(k) };
    }

    function lunarToSolar(ld, lm, ly, leap = false) {
      let a11, b11;
      if (lm < 11) { a11 = month11(ly - 1); b11 = month11(ly); }
      else { a11 = month11(ly); b11 = month11(ly + 1); }
      let off = lm - 11;
      if (off < 0) off += 12;
      if (b11 - a11 > 12) {
        const lo = leapOffset(a11);
        const leapMonth = ((10 + lo - 1) % 12) + 1;
        if (leap && leapMonth !== lm) return null;
        if (leap || off >= lo) off += 1;
      } else if (leap) return null;
      const start = monthStart(a11 + off);
      const len = monthStart(a11 + off + 1) - start;
      if (ld < 1 || ld > len) return null;
      const j = start + ld - 1;
      return { ...fromJdn(j), jdn: j };
    }

    // Tháng nhuận của năm âm ly (0 nếu không có)
    function leapMonthOf(ly) {
      const spans = [[month11(ly - 1), month11(ly), (lo) => lo >= 3], [month11(ly), month11(ly + 1), (lo) => lo <= 2]];
      for (const [a11, b11, belongs] of spans) {
        if (b11 - a11 > 12) {
          const lo = leapOffset(a11);
          if (belongs(lo)) return ((10 + lo - 1) % 12) + 1;
        }
      }
      return 0;
    }

    // Tiết khí (24, mỗi 15°) đang hiệu lực tại đầu ngày d
    function solarTermIndex(d) {
      return Math.floor(sunLongitude(d - 0.5 - tz / 24 + 1) / 15) % 24;
    }

    return { solarToLunar, lunarToSolar, leapMonthOf, solarTermIndex, monthStart };
  }

  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const TIET_KHI = ['Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng', 'Hạ chí',
    'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ', 'Thu phân', 'Hàn lộ', 'Sương giáng',
    'Lập đông', 'Tiểu tuyết', 'Đại tuyết', 'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'];

  // Can chi (chỉ số 0-based)
  const yearCanChi = (ly) => ({ can: (ly + 6) % 10, chi: (ly + 8) % 12 });
  const monthCanChi = (ly, lm) => ({ can: (((ly + 6) % 10) * 2 + 2 + (lm - 1)) % 10, chi: (lm + 1) % 12 });
  const dayCanChi = (j) => ({ can: (j + 9) % 10, chi: (j + 1) % 12 });
  const hourCanChi = (dayCan, hourChi) => ({ can: ((dayCan % 5) * 2 + hourChi) % 10, chi: hourChi });
  const name = (cc) => CAN[cc.can] + ' ' + CHI[cc.chi];

  return { jdn, fromJdn, newMoonUT, sunLongitude, makeCalendar, CAN, CHI, TIET_KHI,
    yearCanChi, monthCanChi, dayCanChi, hourCanChi, name };
})();

if (typeof module !== 'undefined') module.exports = LunarVN;
