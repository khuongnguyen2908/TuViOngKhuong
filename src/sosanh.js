// So sánh hai lá số theo các cách xem tuổi phổ biến ở Việt Nam. Chạy được trong Node như engine.js.
// Nhận hai kết quả của TuViEngine.compute. Không rõ giờ sinh của một người thì bỏ các mục cần cung Mệnh của người đó.
const TuViSoSanh = (() => {
  const mod = (n) => ((n % 12) + 12) % 12;
  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const CAN_HANH = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
  const SINH = { Kim: 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  const KHAC = { Kim: 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };
  const TAM_HOP = ['Thân Tý Thìn', 'Tỵ Dậu Sửu', 'Dần Ngọ Tuất', 'Hợi Mão Mùi'];
  // Người kia "là gì" với mình khi chi năm sinh của họ rơi vào cung này trên lá số của mình
  const CUNG_VAI = {
    'Mệnh': 'gần gũi như chính bản thân, dễ hiểu tính nhau',
    'Phụ Mẫu': 'hay che chở, góp ý như người trên',
    'Phúc Đức': 'mang lại sự an vui, là chỗ dựa tinh thần',
    'Điền Trạch': 'gắn với chuyện nhà cửa, gia đình',
    'Quan Lộc': 'gắn với công việc, sự nghiệp',
    'Nô Bộc': 'như bạn bè, đồng nghiệp ngang hàng',
    'Thiên Di': 'gắn với việc ra ngoài, mở rộng quan hệ',
    'Tật Ách': 'dễ thành nỗi bận tâm, phải lo cho nhau nhiều',
    'Tài Bạch': 'gắn với chuyện tiền bạc, làm ăn',
    'Tử Tức': 'được mình chăm lo, dìu dắt như con cháu',
    'Phu Thê': 'có duyên gắn bó như vợ chồng',
    'Huynh Đệ': 'thân thiết như anh chị em',
  };
  // Cung nên xem thêm theo mối quan hệ
  const QUAN_HE = {
    vochong: { ten: 'Vợ chồng, người yêu', cung: ['Phu Thê'] },
    doitac: { ten: 'Đối tác làm ăn', cung: ['Nô Bộc', 'Tài Bạch'] },
    banbe: { ten: 'Bạn bè, người thân', cung: ['Nô Bộc'] },
  };

  const namOf = (ch) => { const [c, z] = ch.thienBan.canChi.nam.split(' '); return { can: CAN.indexOf(c), chi: CHI.indexOf(z) }; };

  // Quan hệ hai chi (dùng cho chi năm sinh và chi cung Mệnh)
  function chiQuanHe(a, b) {
    const d = mod(a - b);
    if (d === 0) return { loai: 'trung', muc: 'binh' };
    if (d === 4 || d === 8) return { loai: 'tamHop', muc: 'hop', nhom: TAM_HOP.find((g) => g.split(' ').includes(CHI[a])) };
    if ((a + b) % 12 === 1) return { loai: 'lucHop', muc: 'hop' };
    if (d === 6) return { loai: 'xung', muc: 'ky' };
    if ((a + b) % 12 === 7) return { loai: 'hai', muc: 'ky' };
    return { loai: 'khac', muc: 'binh' };
  }

  // a, b: hai lá số; opt: { tenA, tenB, gioA, gioB (false = không rõ giờ), quanHe }
  function compare(a, b, opt = {}) {
    const A = opt.tenA || 'Người thứ nhất', B = opt.tenB || 'Người thứ hai';
    const gioA = opt.gioA !== false, gioB = opt.gioB !== false;
    const qh = QUAN_HE[opt.quanHe] || QUAN_HE.vochong;
    const ta = a.thienBan, tb = b.thienBan, na = namOf(a), nb = namOf(b);
    const muc = [];

    // 1. Ngũ hành bản mệnh (nạp âm năm sinh)
    {
      const ha = ta.hanhMenh, hb = tb.hanhMenh, head = `${A} mệnh ${ta.banMenh}, ${B} mệnh ${tb.banMenh}`;
      let m, text, khuyen = null;
      if (ha === hb) { m = 'binh'; text = `${head}: cùng hành ${ha}, hòa nhau, dễ hiểu nhau nhưng cũng dễ cùng mạnh cùng yếu một chỗ.`; }
      else if (SINH[ha] === hb) { m = 'hop'; text = `${head}: ${ha} sinh ${hb}, ${A} hay nâng đỡ, vun vén cho ${B}.`; }
      else if (SINH[hb] === ha) { m = 'hop'; text = `${head}: ${hb} sinh ${ha}, ${B} hay nâng đỡ, vun vén cho ${A}.`; }
      else { m = 'ky'; const [x, y, X, Y] = KHAC[ha] === hb ? [ha, hb, A, B] : [hb, ha, B, A]; text = `${head}: ${x} khắc ${y}, ${X} dễ lấn át hoặc gây áp lực cho ${Y}.`; khuyen = 'nguHanhKhac'; }
      muc.push({ key: 'nguHanh', ten: 'Ngũ hành bản mệnh', muc: m, text, khuyen });
    }
    // 2. Thiên can năm sinh
    {
      const ca = na.can, cb = nb.can, head = `Can ${CAN[ca]} và ${CAN[cb]}`;
      const hA = CAN_HANH[ca], hB = CAN_HANH[cb];
      let m = 'binh', text = `${head}: không hợp không xung.`, khuyen = null;
      if (ca === cb) text = `${head}: cùng can, tính khí gần nhau.`;
      else if (Math.abs(ca - cb) === 5) { m = 'hop'; text = `${head}: thiên can ngũ hợp, dễ đồng lòng, bàn việc nhanh thống nhất.`; }
      else if (ca % 2 === cb % 2 && (KHAC[hA] === hB || KHAC[hB] === hA)) { m = 'ky'; text = `${head}: thiên can tương xung, dễ bất đồng ý kiến.`; khuyen = 'canXung'; }
      muc.push({ key: 'can', ten: 'Thiên can năm sinh', muc: m, text, khuyen });
    }
    // 3. Địa chi năm sinh (tuổi)
    {
      const r = chiQuanHe(na.chi, nb.chi), head = `Tuổi ${CHI[na.chi]} và tuổi ${CHI[nb.chi]}`;
      const text = {
        trung: `${head}: cùng tuổi, dễ chia sẻ nhưng cũng dễ giống nhau cả điểm yếu.`,
        tamHop: `${head}: cùng nhóm tam hợp ${r.nhom}, được xem là rất hợp, dễ hỗ trợ nhau.`,
        lucHop: `${head}: lục hợp, gắn bó, dễ bù trừ cho nhau.`,
        xung: `${head}: lục xung (tứ hành xung), tính cách trái chiều, dễ va chạm.`,
        hai: `${head}: lục hại, dễ hiểu lầm, phật ý nhau vì chuyện nhỏ.`,
        khac: `${head}: không hợp không xung.`,
      }[r.loai];
      muc.push({ key: 'chi', ten: 'Địa chi năm sinh (tuổi)', muc: r.muc, text, khuyen: r.loai === 'xung' ? 'chiXung' : r.loai === 'hai' ? 'chiHai' : null });
    }
    // 4. Cung Mệnh của hai người (cần giờ sinh của cả hai)
    if (gioA && gioB) {
      const pa = a.palaces[ta.menhCung], pb = b.palaces[tb.menhCung], r = chiQuanHe(ta.menhCung, tb.menhCung);
      const head = `Mệnh ${A} tại ${pa.chiTen}, Mệnh ${B} tại ${pb.chiTen}`;
      const text = {
        trung: `${head}: cùng cung, cách nhìn đời gần nhau.`,
        tamHop: `${head}: tam hợp, chí hướng dễ gặp nhau.`,
        lucHop: `${head}: nhị hợp, dễ gắn bó, bù trừ cho nhau.`,
        xung: `${head}: xung chiếu, góc nhìn ngược chiều nhau.`,
        hai: `${head}: tương hại, hay lệch ý trong việc nhỏ.`,
        khac: `${head}: không hợp không xung.`,
      }[r.loai];
      muc.push({ key: 'menh', ten: 'Cung Mệnh hai người', muc: r.muc, text, khuyen: r.loai === 'xung' ? 'menhXung' : r.loai === 'hai' ? 'chiHai' : null });
    }
    // 5. Tuổi người này rơi vào cung nào trên lá số người kia (chỉ để tham khảo, không chấm hợp / kỵ)
    const roi = (ch, chi, ten, khac) => { const c = ch.palaces[chi].cung; return `Tuổi ${CHI[chi]} của ${khac} rơi vào cung ${c} trên lá số của ${ten}: với ${ten}, ${khac} ${CUNG_VAI[c]}.`; };
    const roiText = [gioA ? roi(a, nb.chi, A, B) : '', gioB ? roi(b, na.chi, B, A) : ''].filter(Boolean);
    if (roiText.length) muc.push({ key: 'roi', ten: 'Tuổi rơi vào cung', muc: 'tt', text: roiText.join(' '), khuyen: null });

    // Cung nên xem thêm theo mối quan hệ
    const cungOf = (ch, ten) => ch.palaces.find((p) => p.cung === ten);
    const lienQuan = [[a, A, gioA], [b, B, gioB]].filter(([, , g]) => g).flatMap(([ch, ten]) => qh.cung.map((c) => {
      const p = cungOf(ch, c), chinhO = (x) => x.stars.filter((s) => s.kind === 'chinh').map((s) => ({ name: s.name, bright: s.bright }));
      const chinh = chinhO(p), xung = ch.palaces[mod(p.chi + 6)];
      // Vô chính diệu: theo lệ mượn chính tinh cung xung chiếu
      const muon = chinh.length ? null : { cung: xung.cung, chinh: chinhO(xung) };
      return { nguoi: ten, cung: c, chiTen: p.chiTen, chinh, muon, hung: p.stars.filter((s) => s.kind === 'hung').map((s) => s.name), tuan: p.tuan, triet: p.triet };
    }));

    const dem = { hop: 0, binh: 0, ky: 0 };
    muc.forEach((x) => { if (x.muc in dem) dem[x.muc]++; });
    const tong = dem.hop - dem.ky;
    const ketLuan = tong >= 2 ? 'Nhiều điểm hợp hơn điểm kỵ: theo cách xem truyền thống, hai người dễ hòa hợp.'
      : tong >= 1 ? 'Điểm hợp nhỉnh hơn điểm kỵ: khá hợp, vài chỗ cần nhường nhịn.'
        : tong === 0 ? 'Điểm hợp và điểm kỵ ngang nhau: bình thường, hợp hay không tùy cách hai người cư xử.'
          : 'Điểm kỵ nhiều hơn điểm hợp: theo cách xem truyền thống cần nhiều nhường nhịn hơn; xem lời khuyên ở từng mục.';
    return { muc, dem, ketLuan, quanHe: qh.ten, lienQuan, thieuGio: !(gioA && gioB) };
  }

  return { compare, chiQuanHe, QUAN_HE, CUNG_VAI };
})();
if (typeof module !== 'undefined') module.exports = TuViSoSanh;
