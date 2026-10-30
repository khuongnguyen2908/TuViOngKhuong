// Tổng hợp 3 hệ cho cùng một người: Tử Vi (chính tinh cung Mệnh), Bát Tự (nhật chủ), Bản đồ sao (Mặt Trời, Mặt Trăng,
// Cung Mọc). Mỗi yếu tố được gắn vài nét tính cách chung; nét nào nhiều hệ cùng nói thì xếp lên trước.
// Bảng gắn nét tự biên soạn từ phần giải nghĩa của từng hệ trong dự án, mang tính tham khảo.
const TuViTongHop = (() => {
  // Nét tính cách: [tên, loại] — 'manh' là điểm mạnh, 'luuy' là điểm cần lưu ý
  const NET = {
    dandat: ['Thích dẫn dắt, làm chủ', 'manh'],
    hanhdong: ['Dám làm, quyết đoán', 'manh'],
    thucte: ['Thực tế, chắc chắn', 'manh'],
    kientri: ['Kiên trì, bền bỉ', 'manh'],
    kyluat: ['Nguyên tắc, có kỷ luật', 'manh'],
    linhhoat: ['Linh hoạt, nhanh nhạy', 'manh'],
    giaotiep: ['Giỏi giao tiếp, ăn nói', 'manh'],
    tritue: ['Thích suy nghĩ, phân tích', 'manh'],
    camxuc: ['Giàu cảm xúc, nhạy cảm', 'manh'],
    chamsoc: ['Chu đáo, biết chăm lo người khác', 'manh'],
    sangtao: ['Sáng tạo, có gu thẩm mỹ', 'manh'],
    tudo: ['Thích tự do, khám phá', 'manh'],
    nongvoi: ['Dễ nóng vội', 'luuy'],
    loau: ['Hay lo nghĩ', 'luuy'],
    cochap: ['Dễ cố chấp, bảo thủ', 'luuy'],
    thieukien: ['Dễ đổi ý, thiếu kiên trì', 'luuy'],
  };
  const KHUYEN = {
    nongvoi: 'Với việc quan trọng, đợi qua một đêm rồi mới quyết; hỏi ý một người bình tĩnh hơn mình.',
    loau: 'Viết nỗi lo ra giấy và chia thành việc làm được ngay; việc ngoài tầm tay thì tập buông.',
    cochap: 'Trước khi bác một ý kiến, thử nhắc lại nó bằng lời của mình; thay đổi nhỏ trước khi thay đổi lớn.',
    thieukien: 'Chọn ít mục tiêu hơn, đặt hạn chót và một người nhắc; xong việc này rồi mới mở việc khác.',
  };
  // Tử Vi: chính tinh ở cung Mệnh (vô chính diệu thì mượn chính tinh cung xung chiếu)
  const TU_VI = {
    'Tử Vi': ['dandat', 'kyluat', 'cochap'], 'Thiên Cơ': ['tritue', 'linhhoat', 'loau'], 'Thái Dương': ['giaotiep', 'dandat', 'hanhdong'],
    'Vũ Khúc': ['thucte', 'hanhdong', 'cochap'], 'Thiên Đồng': ['chamsoc', 'camxuc', 'thieukien'], 'Liêm Trinh': ['kyluat', 'hanhdong', 'nongvoi'],
    'Thiên Phủ': ['thucte', 'kientri', 'chamsoc'], 'Thái Âm': ['camxuc', 'sangtao', 'chamsoc'], 'Tham Lang': ['giaotiep', 'sangtao', 'tudo'],
    'Cự Môn': ['giaotiep', 'tritue', 'loau'], 'Thiên Tướng': ['chamsoc', 'kyluat', 'thucte'], 'Thiên Lương': ['chamsoc', 'tritue', 'cochap'],
    'Thất Sát': ['hanhdong', 'dandat', 'nongvoi'], 'Phá Quân': ['hanhdong', 'tudo', 'nongvoi'],
  };
  // Bát Tự: nhật chủ theo 10 thiên can
  const BAT_TU = [
    ['dandat', 'kientri', 'cochap'], ['linhhoat', 'giaotiep', 'sangtao'], ['hanhdong', 'giaotiep', 'nongvoi'], ['chamsoc', 'tritue', 'loau'], ['thucte', 'kientri', 'cochap'],
    ['chamsoc', 'thucte', 'loau'], ['hanhdong', 'kyluat', 'nongvoi'], ['sangtao', 'kyluat', 'camxuc'], ['tritue', 'tudo', 'thieukien'], ['camxuc', 'tritue', 'loau'],
  ];
  // Bản đồ sao: 12 cung hoàng đạo (dùng cho Mặt Trời, Mặt Trăng, Cung Mọc)
  const CUNG = [
    ['hanhdong', 'dandat', 'nongvoi'], ['thucte', 'kientri', 'cochap'], ['giaotiep', 'linhhoat', 'thieukien'], ['camxuc', 'chamsoc', 'loau'],
    ['dandat', 'sangtao', 'giaotiep'], ['tritue', 'kyluat', 'loau'], ['giaotiep', 'sangtao', 'thieukien'], ['camxuc', 'kientri', 'cochap'],
    ['tudo', 'hanhdong', 'thieukien'], ['kyluat', 'thucte', 'kientri'], ['tudo', 'tritue', 'sangtao'], ['camxuc', 'sangtao', 'chamsoc'],
  ];
  const CUNG_TEN = ['Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ', 'Thiên Bình', 'Bọ Cạp', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'];
  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

  // nguon: { tuVi: [tên chính tinh ở Mệnh] | null, muon: bool, batTu: chỉ số can ngày, sao: { mt, tr, moc } chỉ số cung (moc có thể null) }
  // Trả về danh sách nét: { key, ten, loai, he: [{ he, vi }], so } sắp theo số hệ cùng nói
  function compare(nguon) {
    const gom = {};
    const them = (keys, he, vi) => keys.forEach((k) => {
      gom[k] = gom[k] || { key: k, ten: NET[k][0], loai: NET[k][1], he: [] };
      const cu = gom[k].he.find((x) => x.he === he);
      if (cu) { if (!cu.vi.includes(vi)) cu.vi.push(vi); } else gom[k].he.push({ he, vi: [vi] });
    });
    if (nguon.tuVi && nguon.tuVi.length) nguon.tuVi.forEach((s) => TU_VI[s] && them(TU_VI[s], 'Tử Vi', `${s} ${nguon.muon ? '(mượn) ' : ''}ở Mệnh`));
    if (Number.isInteger(nguon.batTu)) them(BAT_TU[nguon.batTu], 'Bát Tự', `Nhật chủ ${CAN[nguon.batTu]}`);
    if (nguon.sao) {
      const { mt, tr, moc } = nguon.sao;
      them(CUNG[mt], 'Bản đồ sao', `Mặt Trời ${CUNG_TEN[mt]}`);
      if (Number.isInteger(tr)) them(CUNG[tr], 'Bản đồ sao', `Mặt Trăng ${CUNG_TEN[tr]}`);
      if (Number.isInteger(moc)) them(CUNG[moc], 'Bản đồ sao', `Cung Mọc ${CUNG_TEN[moc]}`);
    }
    return Object.values(gom).map((x) => ({ ...x, so: x.he.length }))
      .sort((a, b) => b.so - a.so || b.he.reduce((s, h) => s + h.vi.length, 0) - a.he.reduce((s, h) => s + h.vi.length, 0));
  }
  // Ngũ hành (Bát Tự) đặt cạnh nguyên tố (Bản đồ sao): hai cách chia khác nhau, chỉ ghép những cặp gần nghĩa
  const GHEP = [['Hỏa', 'Lửa'], ['Thổ', 'Đất'], ['Thủy', 'Nước'], ['Kim', null], ['Mộc', null], [null, 'Khí']];
  return { NET, KHUYEN, TU_VI, BAT_TU, CUNG, GHEP, compare };
})();
if (typeof module !== 'undefined') module.exports = TuViTongHop;
