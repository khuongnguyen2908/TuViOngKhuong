// Thần số học (Pythagoras): chỉ số từ ngày sinh dương lịch và họ tên. Chạy được trong Node như engine.js.
// Quy ước: A=1 … I=9, J=1 …; nguyên âm A E I O U (Y tính là phụ âm); giữ số bậc thầy 11, 22, 33.
// Lời giải nghĩa tự biên soạn, mang tính tham khảo.
const TuViThanSo = (() => {
  const tong = (n) => String(n).split('').reduce((s, c) => s + (+c || 0), 0);
  const BAC_THAY = [11, 22, 33];
  // rút gọn về 1 chữ số; giu = true thì dừng ở 11, 22, 33
  const rut = (n, giu = true) => { while (n > 9 && !(giu && BAC_THAY.includes(n))) n = tong(n); return n; };
  const hien = (n) => (n === 22 ? '22/4' : n === 33 ? '33/6' : String(n));
  const goc = (n) => rut(n, false); // 11 → 2, 22 → 4
  const chuCai = (ten) => ten.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase().replace(/[^A-Z]/g, '');
  const giaTri = (c) => ((c.charCodeAt(0) - 65) % 9) + 1;
  const NGUYEN_AM = 'AEIOU';
  // Lưới 3×3: cột trái 1-2-3 (dưới lên), giữa 4-5-6, phải 7-8-9
  const MUI_TEN = [
    ['123', 'Kế hoạch', 'Thiếu tổ chức'], ['456', 'Ý chí', 'Dễ thất vọng'], ['789', 'Hoạt động', 'Thụ động'],
    ['147', 'Thực tế', 'Thiếu thực tế'], ['258', 'Cân bằng cảm xúc', 'Nhạy cảm'], ['369', 'Trí tuệ', 'Trí nhớ ngắn hạn'],
    ['159', 'Quyết tâm', 'Trì hoãn'], ['357', 'Nhạy bén tâm linh', 'Hoài nghi'],
  ];

  function compute({ name, day, month, year, namXem }) {
    const chuSoNgay = `${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${year}`;
    const chuDao = rut(tong(chuSoNgay));
    const ngaySinh = rut(day);
    const thaiDo = rut(tong(day) + tong(month), false);
    const cc = chuCai(name || '');
    const am = cc.split('').filter((c) => NGUYEN_AM.includes(c)), phu = cc.split('').filter((c) => !NGUYEN_AM.includes(c));
    const sum = (ds) => ds.reduce((s, c) => s + giaTri(c), 0);
    const coTen = cc.length > 0;
    const linhHon = coTen ? rut(sum(am)) : null, nhanCach = coTen ? rut(sum(phu)) : null, suMenh = coTen ? rut(sum(am) + sum(phu)) : null;
    const truongThanh = coTen ? rut(chuDao + suMenh) : null;
    const tuDuy = coTen ? rut(ngaySinh + suMenh) : null;
    // Năm, tháng cá nhân
    const namCaNhan = (y) => rut(tong(day) + tong(month) + tong(y), false);
    const nx = namXem || new Date().getFullYear();
    const thang = Array.from({ length: 12 }, (_, i) => rut(namCaNhan(nx) + i + 1, false));
    // Biểu đồ ngày sinh và biểu đồ tên: số lần mỗi số 1–9 xuất hiện
    const dem = Array(10).fill(0);
    chuSoNgay.split('').forEach((c) => { if (c !== '0') dem[+c]++; });
    const demTen = Array(10).fill(0);
    cc.split('').forEach((c) => { demTen[giaTri(c)]++; });
    const co = (d) => dem[+d] > 0;
    const muiTen = { co: MUI_TEN.filter(([k]) => k.split('').every(co)).map(([k, ten]) => ({ k, ten })), trong: MUI_TEN.filter(([k]) => !k.split('').some(co)).map(([k, , ten]) => ({ k, ten })) };
    const thieu = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !dem[d]);
    const buTen = thieu.filter((d) => demTen[d] > 0);
    // 4 đỉnh cao và 4 thử thách (tháng, ngày, năm rút gọn về 1 chữ số)
    const m = goc(month), d = goc(day), y = goc(tong(year)), lp = goc(chuDao);
    const p1 = rut(m + d), p2 = rut(d + y), p3 = rut(goc(p1) + goc(p2)), p4 = rut(m + y);
    const tuoi1 = 36 - lp;
    const dinhCao = [p1, p2, p3, p4].map((so, i) => ({ so, tu: i ? tuoi1 + 9 * (i - 1) + 1 : 0, den: i < 3 ? tuoi1 + 9 * i : null, nam: year + (i ? tuoi1 + 9 * (i - 1) + 1 : 0) }));
    const c1 = Math.abs(m - d), c2 = Math.abs(d - y);
    const thuThach = [c1, c2, Math.abs(c1 - c2), Math.abs(m - y)];
    return {
      ten: name || '', chuCai: cc, ngay: { day, month, year }, namXem: nx,
      chuDao, ngaySinh, thaiDo, linhHon, nhanCach, suMenh, truongThanh, tuDuy,
      namCaNhan: namCaNhan(nx), chuKy: Array.from({ length: 11 }, (_, i) => ({ nam: nx - 5 + i, so: namCaNhan(nx - 5 + i) })), thang,
      dem, demTen, muiTen, thieu, buTen, dinhCao, thuThach,
    };
  }

  // ---------- Giải nghĩa ----------
  const SO = {
    1: { tuKhoa: 'độc lập, tiên phong, tự chủ', moTa: 'Người số 1 muốn tự quyết con đường của mình, thích đi đầu và làm theo cách riêng. Bạn có ý chí mạnh, dám nhận trách nhiệm, nhưng dễ cô độc vì ít khi nhờ ai.',
      manh: ['Tự lập, quyết đoán', 'Dám khởi đầu việc mới', 'Có chính kiến rõ'], yeu: ['Bướng, khó nghe góp ý', 'Thiếu kiên nhẫn với người chậm hơn', 'Ngại nhờ giúp đỡ'], khuyen: 'Tập lắng nghe trước khi quyết; giao bớt việc cho người khác để đi xa hơn.' },
    2: { tuKhoa: 'nhạy cảm, hòa giải, hợp tác', moTa: 'Người số 2 cảm nhận tinh tế, giỏi đọc cảm xúc người khác và làm cầu nối. Bạn làm tốt nhất khi có người đồng hành, nhưng dễ tổn thương và thiếu tự tin.',
      manh: ['Tinh tế, biết lắng nghe', 'Hợp tác tốt', 'Trực giác nhạy'], yeu: ['Dễ tổn thương', 'Do dự, sợ làm phật lòng', 'Hay so sánh mình với người khác'], khuyen: 'Tin vào cảm nhận của mình, tập nói "không" khi cần; viết ra điều mình muốn trước khi nghe ý người khác.' },
    3: { tuKhoa: 'sáng tạo, biểu đạt, vui vẻ', moTa: 'Người số 3 nhanh trí, có óc hài hước và giỏi diễn đạt bằng lời, chữ hay hình ảnh. Bạn cần được thể hiện, nhưng dễ phân tán và chán nhanh.',
      manh: ['Sáng tạo, nhiều ý tưởng', 'Giao tiếp duyên dáng', 'Lạc quan, truyền cảm hứng'], yeu: ['Thiếu tập trung', 'Dễ nói quá lời', 'Ngại việc lặp lại'], khuyen: 'Chọn một kênh sáng tạo chính và làm đến nơi; ghi lại ý tưởng thay vì nhảy ngay sang việc mới.' },
    4: { tuKhoa: 'thực tế, kỷ luật, xây dựng', moTa: 'Người số 4 thích trật tự, làm việc chăm chỉ và đáng tin. Bạn giỏi biến kế hoạch thành kết quả cụ thể, nhưng dễ cứng nhắc và ngại thay đổi.',
      manh: ['Chăm chỉ, đáng tin', 'Tổ chức tốt', 'Kiên trì'], yeu: ['Cứng nhắc', 'Lo lắng về sự an toàn', 'Khó thư giãn'], khuyen: 'Cho phép mình thử cái mới theo bước nhỏ; dành thời gian nghỉ như một phần của kế hoạch.' },
    5: { tuKhoa: 'tự do, trải nghiệm, linh hoạt', moTa: 'Người số 5 yêu tự do, thích đi, thích thử và học qua trải nghiệm. Bạn thích nghi nhanh, có sức hút, nhưng dễ bồn chồn và thiếu cam kết.',
      manh: ['Linh hoạt, ứng biến nhanh', 'Ham học hỏi', 'Thu hút, dễ kết nối'], yeu: ['Bồn chồn, dễ chán', 'Thiếu cam kết lâu dài', 'Dễ sa vào hưởng thụ'], khuyen: 'Giữ vài cam kết cốt lõi làm điểm neo; tự do bền nhất là tự do có kỷ luật.' },
    6: { tuKhoa: 'yêu thương, trách nhiệm, chăm sóc', moTa: 'Người số 6 sống vì gia đình và người thân, giàu tình cảm và có trách nhiệm. Bạn thích chăm lo, có gu thẩm mỹ, nhưng dễ ôm đồm và áp đặt cách yêu thương của mình.',
      manh: ['Tận tâm, có trách nhiệm', 'Ấm áp, biết chăm sóc', 'Có óc thẩm mỹ'], yeu: ['Ôm đồm, khó từ chối', 'Lo cho người khác quá mức', 'Dễ áp đặt'], khuyen: 'Chăm sóc bản thân cũng là trách nhiệm; để người khác tự lớn lên bằng lựa chọn của họ.' },
    7: { tuKhoa: 'tìm hiểu, phân tích, nội tâm', moTa: 'Người số 7 thích đi sâu vào bản chất mọi việc và học qua trải nghiệm của chính mình. Bạn có chiều sâu, độc lập trong suy nghĩ, nhưng dễ khép kín và hoài nghi.',
      manh: ['Sâu sắc, phân tích tốt', 'Độc lập', 'Ham hiểu biết'], yeu: ['Khép kín, khó gần', 'Hoài nghi', 'Hay phải tự vấp mới chịu tin'], khuyen: 'Chia sẻ điều mình nghĩ với vài người tin cậy; học từ kinh nghiệm người khác để bớt phải tự vấp.' },
    8: { tuKhoa: 'tham vọng, quản lý, tài chính', moTa: 'Người số 8 có khả năng tổ chức, nhạy với tiền bạc và quyền hạn. Bạn độc lập, muốn tự chủ tài chính, nhưng dễ đặt nặng thành công vật chất và khó bày tỏ cảm xúc.',
      manh: ['Quản lý giỏi', 'Có đầu óc kinh doanh', 'Bền bỉ'], yeu: ['Đặt nặng vật chất', 'Khó bày tỏ cảm xúc', 'Dễ căng thẳng vì công việc'], khuyen: 'Đặt ranh giới giữa công việc và gia đình; thành công bền khi đi cùng sự tử tế.' },
    9: { tuKhoa: 'lý tưởng, nhân ái, vì cộng đồng', moTa: 'Người số 9 giàu lý tưởng, muốn sống có ích cho nhiều người. Bạn có tầm nhìn rộng, bao dung, nhưng dễ vỡ mộng khi thực tế không như mong muốn.',
      manh: ['Nhân ái, rộng lượng', 'Có trách nhiệm với cộng đồng', 'Tầm nhìn rộng'], yeu: ['Dễ thất vọng', 'Lý tưởng hóa người khác', 'Quên chăm lo cho bản thân'], khuyen: 'Biến lý tưởng thành việc nhỏ làm được mỗi tuần; chấp nhận thế giới chưa hoàn hảo.' },
    11: { tuKhoa: 'trực giác, cảm hứng, tâm linh', moTa: 'Số 11 là số bậc thầy: nhạy cảm như số 2 nhưng mạnh hơn về trực giác và khả năng truyền cảm hứng. Bạn hay có linh cảm đúng, giàu lý tưởng, nhưng dễ căng thẳng, lo âu nếu chưa tìm được hướng đi.',
      manh: ['Trực giác mạnh', 'Truyền cảm hứng', 'Giàu lòng trắc ẩn'], yeu: ['Dễ căng thẳng, lo âu', 'Kỳ vọng quá cao', 'Cảm xúc lên xuống'], khuyen: 'Giữ nếp sinh hoạt đều đặn để tinh thần vững; đặt lý tưởng vào việc cụ thể giúp người.' },
    22: { tuKhoa: 'kiến tạo lớn, thực tế, tầm nhìn', moTa: 'Số 22/4 là số bậc thầy về xây dựng: có tầm nhìn của người mơ lớn và đôi tay của người làm thật. Bạn có thể làm nên việc lớn, nhưng áp lực tự đặt ra cũng nặng.',
      manh: ['Tầm nhìn lớn', 'Thực tế, có phương pháp', 'Tổ chức giỏi'], yeu: ['Áp lực lớn lên bản thân', 'Cứng nhắc khi căng thẳng', 'Khó hài lòng'], khuyen: 'Chia mục tiêu lớn thành chặng nhỏ; ghi nhận từng bước tiến thay vì chỉ nhìn đích.' },
    33: { tuKhoa: 'yêu thương, nâng đỡ, chữa lành', moTa: 'Số 33/6 hiếm gặp, mang năng lượng của số 6 ở mức cao: muốn chăm sóc, nâng đỡ và chữa lành cho nhiều người. Bạn giàu yêu thương, nhưng dễ kiệt sức vì gánh thay người khác.',
      manh: ['Giàu yêu thương', 'Biết nâng đỡ người khác', 'Có trách nhiệm'], yeu: ['Dễ kiệt sức', 'Hy sinh quá mức', 'Khó nhận sự giúp đỡ'], khuyen: 'Đặt giới hạn cho việc giúp người; nghỉ ngơi đủ để còn sức yêu thương lâu dài.' },
  };
  const CHI_SO = {
    chuDao: ['Số chủ đạo', 'Cộng mọi chữ số của ngày, tháng, năm sinh', 'Con đường chính và bài học lớn nhất của đời bạn.'],
    linhHon: ['Số linh hồn', 'Cộng các nguyên âm trong họ tên', 'Điều bạn khao khát sâu bên trong.'],
    suMenh: ['Số sứ mệnh', 'Cộng mọi chữ cái trong họ tên', 'Năng lực và cách bạn thể hiện mình với đời.'],
    nhanCach: ['Số nhân cách', 'Cộng các phụ âm trong họ tên', 'Ấn tượng bạn để lại cho người khác.'],
    thaiDo: ['Số thái độ', 'Cộng ngày và tháng sinh', 'Phản ứng đầu tiên của bạn trước mọi việc.'],
    ngaySinh: ['Số ngày sinh', 'Rút gọn ngày sinh', 'Tài năng tự nhiên bạn mang theo.'],
    truongThanh: ['Số trưởng thành', 'Số chủ đạo cộng số sứ mệnh', 'Hướng phát triển rõ dần từ khoảng 35–40 tuổi.'],
    tuDuy: ['Số tư duy', 'Số ngày sinh cộng số sứ mệnh', 'Cách bạn suy nghĩ và ra quyết định.'],
  };
  const NAM = {
    1: ['Khởi đầu', 'Năm mở đầu chu kỳ 9 năm mới: hợp để khởi sự, đặt mục tiêu, thử hướng đi mới.', 'Chọn rõ 1–2 mục tiêu lớn cho cả chu kỳ và bắt tay ngay.'],
    2: ['Kết nối, kiên nhẫn', 'Năm của hợp tác và chờ đợi: việc tiến chậm, quan hệ quan trọng hơn kết quả.', 'Kiên nhẫn, chăm sóc các mối quan hệ; đừng ép tiến độ.'],
    3: ['Sáng tạo, thể hiện', 'Năm cởi mở, giao lưu, sáng tạo; dễ có niềm vui nhưng cũng dễ phân tán.', 'Thể hiện bản thân nhưng giữ tập trung vào mục tiêu đã đặt.'],
    4: ['Xây nền móng', 'Năm làm việc chăm chỉ, sắp xếp lại tài chính, sức khỏe, công việc.', 'Lập kế hoạch chi tiết, giữ kỷ luật; đừng nản khi thấy mệt.'],
    5: ['Thay đổi, tự do', 'Năm nhiều biến động: đi lại, đổi việc, gặp người mới; có cơ hội bất ngờ.', 'Đón nhận thay đổi nhưng cân nhắc trước quyết định lớn; giữ một khoản an toàn.'],
    6: ['Gia đình, trách nhiệm', 'Năm hướng về gia đình, nhà cửa và các cam kết; có thể có chuyện cưới hỏi, chăm sóc người thân.', 'Dành thời gian cho người thân; nhận trách nhiệm vừa sức.'],
    7: ['Nhìn lại, học hỏi', 'Năm lắng lại để học, nghiên cứu và nhìn lại bản thân; không hợp để phô trương.', 'Đầu tư cho kiến thức và sức khỏe tinh thần; chậm lại để nghĩ kỹ.'],
    8: ['Thành quả, tài chính', 'Năm gặt hái từ nỗ lực trước đó: công việc, tiền bạc, vị trí có thể lên.', 'Quản lý tiền chặt chẽ, nắm cơ hội nhưng giữ chữ tín.'],
    9: ['Khép lại, buông bỏ', 'Năm kết thúc chu kỳ: hoàn tất việc dang dở, buông những gì không còn hợp.', 'Dọn dẹp, tha thứ, khép lại việc cũ để chuẩn bị chu kỳ mới.'],
  };
  const MUI_TEN_Y = {
    'Kế hoạch': 'Giỏi sắp xếp, lên kế hoạch và làm theo trình tự.', 'Ý chí': 'Ý chí mạnh, đã quyết là làm đến cùng.',
    'Hoạt động': 'Năng động, thích bắt tay vào làm hơn là ngồi bàn.', 'Thực tế': 'Thực tế, khéo tay, giỏi việc cụ thể.',
    'Cân bằng cảm xúc': 'Cảm xúc ổn định, biết thấu hiểu người khác.', 'Trí tuệ': 'Trí nhớ tốt, tư duy sắc bén, thích học hỏi.',
    'Quyết tâm': 'Kiên định, có mục tiêu thì theo đuổi đến cùng.', 'Nhạy bén tâm linh': 'Trực giác tốt, bao dung, dễ cảm thông.',
    'Thiếu tổ chức': ['Dễ bừa bộn, khó sắp xếp việc theo trình tự.', 'Dùng lịch và danh sách việc; làm xong việc này rồi mới sang việc khác.'],
    'Dễ thất vọng': ['Dễ hụt hẫng khi mọi việc không như ý.', 'Đặt kỳ vọng vừa phải; chia việc lớn thành bước nhỏ để thấy mình tiến bộ.'],
    'Thụ động': ['Dễ chần chừ, chờ hoàn cảnh thuận mới làm.', 'Bắt đầu bằng một việc nhỏ ngay hôm nay và đặt hạn chót cho nó.'],
    'Thiếu thực tế': ['Hay nghĩ nhiều hơn làm, ngại việc chân tay.', 'Làm thử bằng tay, ghi kế hoạch thành từng bước cụ thể.'],
    'Nhạy cảm': ['Dễ tổn thương, cảm xúc lên xuống.', 'Tập gọi tên cảm xúc và chia sẻ với người tin cậy thay vì giữ trong lòng.'],
    'Trí nhớ ngắn hạn': ['Dễ quên, khó tập trung lâu.', 'Ghi chép, ôn lại đều đặn; ngủ đủ giấc.'],
    'Trì hoãn': ['Dễ do dự, để việc đến phút chót.', 'Đặt mục tiêu rõ và hạn chót; nhờ một người nhắc.'],
    'Hoài nghi': ['Khó tin người, cần bằng chứng mới tin.', 'Hoài nghi vừa đủ để cẩn thận; cho người khác cơ hội chứng minh.'],
  };
  const THIEU = {
    1: ['Khó bày tỏ bản thân, ngại nói ra điều mình muốn.', 'Tập nói rõ mong muốn của mình trong những việc nhỏ hằng ngày.'],
    2: ['Trực giác và sự kiên nhẫn với người khác cần rèn thêm.', 'Dành thời gian lắng nghe trước khi phản hồi.'],
    3: ['Dễ thiếu tự tin khi thể hiện ý tưởng, đôi lúc bi quan.', 'Viết, vẽ hoặc kể chuyện để luyện cách diễn đạt.'],
    4: ['Dễ thiếu ngăn nắp, ngại việc chi tiết.', 'Giữ một nếp sinh hoạt cố định và sắp xếp chỗ làm việc gọn gàng.'],
    5: ['Dễ thiếu động lực, khó cân bằng giữa tự do và trách nhiệm.', 'Đặt mục tiêu ngắn, thưởng cho mình khi xong.'],
    6: ['Dễ ngại thể hiện sự quan tâm với người thân.', 'Chủ động hỏi han, giúp đỡ gia đình bằng việc cụ thể.'],
    7: ['Hay phải học qua trải nghiệm thực tế, đôi khi phải trả giá.', 'Tham khảo kinh nghiệm người đi trước trước khi làm việc lớn.'],
    8: ['Cần học cách quản lý tiền bạc và chi tiết.', 'Ghi chép thu chi, lập ngân sách đơn giản.'],
    9: ['Có thể thiếu lý tưởng chung, chủ yếu nghĩ cho mình.', 'Tham gia một việc thiện nguyện hoặc việc chung nhỏ.'],
  };
  const THU_THACH = [
    'Có nhiều hướng đi, thử thách là tự chọn và chịu trách nhiệm với lựa chọn của mình.', 'Khẳng định bản thân mà không áp đặt người khác.',
    'Bớt nhạy cảm, tin vào chính mình.', 'Thể hiện cảm xúc và ý tưởng đúng cách, đúng lúc.', 'Kiên nhẫn và giữ kỷ luật.',
    'Tự do có trách nhiệm, không chạy trốn cam kết.', 'Nhận trách nhiệm mà không ôm đồm, không áp đặt.', 'Mở lòng, tin người hơn.',
    'Cân bằng giữa tiền bạc và giá trị sống.',
  ];
  return { compute, rut, hien, chuCai, SO, CHI_SO, NAM, MUI_TEN, MUI_TEN_Y, THIEU, THU_THACH };
})();
if (typeof module !== 'undefined') module.exports = TuViThanSo;
