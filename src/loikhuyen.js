// Lời khuyên cho các điểm xấu trên lá số — tự biên soạn, mang tính tham khảo.
// Giọng: việc cụ thể nên làm để giảm bớt cái xấu; không phán chắc, không chẩn đoán bệnh, không khuyên đầu tư cụ thể.
const TuViLoiKhuyen = (() => {
  // Hung cách và cách "biến" có mặt xấu (theo id trong cachcuc.js)
  const CACH = {
    kinhDaGiapMenh: 'Giữ chữ tín và sự kín đáo trong chuyện tiền bạc. Khi có tranh chấp, nhờ người thứ ba hoặc giấy tờ rõ ràng phân xử thay vì đôi co.',
    khongKiepGiapMenh: 'Chia tiền thành phần để dành và phần xoay vòng, không dồn hết vào một chỗ. Kế hoạch lớn nên có phương án dự phòng.',
    hoaLinhGiapMenh: 'Tập thói quen chờ qua một đêm rồi mới trả lời việc gấp. Ngủ đủ, vận động đều để tinh thần bớt căng.',
    khongKiepThuMenh: 'Hướng óc khác người vào việc sáng tạo, nghiên cứu. Giữ khoản dự phòng đủ sống vài tháng; tránh cờ bạc, đầu cơ và vay mượn để làm ăn.',
    cuPhungTuSat: 'Nói ít, viết rõ: việc quan trọng nên trao đổi bằng văn bản. Khi bất đồng, dừng lại trước khi lời nói thành xúc phạm.',
    linhXuongDaVu: 'Mọi giao dịch tiền bạc, giấy tờ nên có hợp đồng, biên nhận. Đọc kỹ trước khi ký và giữ bản sao.',
    locPhungXungPha: 'Đặt quy tắc riêng cho việc cho vay, đứng tên, bảo lãnh. Tiền dư nên để vào chỗ khó rút ra tiêu, như tiết kiệm có kỳ hạn.',
    hinhTuGiapAn: 'Làm đúng quy trình, giữ giấy tờ đầy đủ. Gặp chuyện pháp lý nên hỏi người có chuyên môn sớm thay vì tự xoay xở.',
    nhatNguyetPhanBoi: 'Đừng chờ được nâng đỡ: học một nghề thật vững và xây quan hệ bằng sự đáng tin. Làm việc có giờ giấc, đừng để kiệt sức vì việc của người khác.',
    kyThuMenh: 'Nói rõ ý mình ngay từ đầu để bớt hiểu lầm. Chuẩn bị kỹ hơn người khác một bước thì trở ngại sẽ nhẹ đi; chọn việc cần sự tỉ mỉ, bền bỉ.',
    kinhDaHamThuMenh: 'Mềm trong cách nói, cứng trong nguyên tắc. Việc kéo dài nên đặt mốc dứt điểm; tránh tranh cãi chỉ vì sĩ diện.',
    hoaLinhHamThuMenh: 'Khi nóng giận, rời khỏi chỗ đó vài phút rồi mới nói hay quyết. Việc lớn nên để qua một đêm rồi mới chốt.',
    satTinhHoiMenh: 'Chọn môi trường có luật lệ rõ ràng, cạnh tranh công bằng. Tích lũy dần, đừng dồn hết vốn vào một lần; quanh mình nên có vài người dám góp ý thẳng.',
    tuanTrietDuongDau: 'Thời trẻ nên dồn sức học nghề và gây dựng quan hệ hơn là chờ kết quả nhanh. Bị chặn giữa chừng thì sửa kế hoạch chứ đừng bỏ hẳn.',
    hinhSatThuMenh: 'Cẩn thận khi lái xe, dùng máy móc, dao kéo; dùng đồ bảo hộ khi cần. Trong công việc giữ thái độ công bằng để bớt va chạm.',
    maDauDoiKiem: 'Chấp nhận giai đoạn đầu vất vả để rèn bản lĩnh, đừng nóng vội đòi kết quả. Cẩn thận an toàn khi lái xe, dùng dao kéo, máy móc.',
    menhVoChinhDieu: 'Mình dễ chịu ảnh hưởng của người bên cạnh, nên chọn bạn và môi trường cho kỹ. Đặt cho mình vài nguyên tắc riêng để không bị cuốn theo.',
  };
  // Cách cát bị sát tinh / Hóa Kỵ phá
  const PHA = 'Phát huy điểm mạnh của cách nhưng tránh nóng vội, liều lĩnh. Việc lớn nên có người góp ý và có phương án dự phòng.';

  // Chính tinh ở thế hãm
  const CHINH_HAM = {
    'Tử Vi': 'Học cách lắng nghe và chia bớt quyền. Ghi nhận công người khác một cách thật lòng thì người giúp mình mới thật lòng.',
    'Thiên Cơ': 'Chọn một kế hoạch và theo đến cùng trong một thời gian đặt trước. Viết nỗi lo ra giấy để đầu óc nhẹ hơn.',
    'Thái Dương': 'Giúp người trong sức mình, biết từ chối khi đã quá tải. Giữ một phần thu nhập cố định để dành.',
    'Vũ Khúc': 'Trước quyết định tiền lớn, hỏi ý một người mình tin và chờ vài ngày. Dành thời gian cho người thân để bớt cô độc.',
    'Thiên Đồng': 'Đặt mục tiêu nhỏ có hạn chót cụ thể. Tìm một người đồng hành nhắc nhở để không bỏ dở giữa chừng.',
    'Liêm Trinh': 'Giữ nguyên tắc nhưng mềm cách nói. Tránh dính vào chuyện tình cảm, tiền bạc mập mờ; giấy tờ luôn rõ ràng.',
    'Thiên Phủ': 'Chặt chẽ vừa đủ: thử những thay đổi nhỏ trước khi thay đổi lớn, và dành một phần tiền cho việc mới sau khi đã tìm hiểu kỹ.',
    'Thái Âm': 'Chia sẻ cảm xúc với người tin cậy thay vì giữ trong lòng. Giữ tài sản bằng sổ sách rõ ràng, đứng tên minh bạch.',
    'Tham Lang': 'Đặt giới hạn cho rượu, cuộc vui và chi tiêu giải trí. Chọn một sở trường để theo lâu dài thay vì thử nhiều thứ.',
    'Cự Môn': 'Nghĩ kỹ trước khi nói, nhất là lúc giận; không bàn chuyện người vắng mặt. Việc quan trọng nên trao đổi bằng văn bản.',
    'Thiên Tướng': 'Tập nói "không" với việc vượt sức mình. Tránh đứng ra bảo lãnh, gánh nợ thay người khác.',
    'Thiên Lương': 'Góp ý khi được hỏi, và góp bằng việc làm hơn lời nói. Tôn trọng cách sống của người khác dù mình thấy chưa đúng.',
    'Thất Sát': 'Quyết định lớn nên có thời gian chờ và một người phản biện. Chú ý an toàn khi đi lại, làm việc nặng.',
    'Phá Quân': 'Trước khi bỏ cái cũ, chuẩn bị xong cái mới. Giữ khoản tiền dự phòng và giữ gìn các mối quan hệ lâu năm.',
  };

  // Sát tinh, hung tinh (kể cả bản lưu niên L. và lưu đại hạn ĐV.)
  const SAO = {
    'Kình Dương': 'Dồn sức quyết liệt vào việc cần quyết đoán, nhưng tránh đối đầu trực diện. Cẩn thận khi lái xe, dùng dao kéo.',
    'Đà La': 'Việc gì cũng đặt hạn chót và dứt điểm. Đừng để chuyện nhỏ kéo dài thành gánh nặng.',
    'Địa Không': 'Kiểm tra kỹ trước khi bỏ tiền vào việc gì. Ý tưởng lạ nên thử nhỏ trước rồi mới làm lớn.',
    'Địa Kiếp': 'Giữ khoản dự phòng, tránh cờ bạc, đầu cơ, vay nóng. Biến cố đến thì bình tĩnh làm lại từng bước.',
    'Hỏa Tinh': 'Khi nóng, dừng lại vài phút rồi mới nói. Cẩn thận với lửa, điện và đồ nóng.',
    'Linh Tinh': 'Đừng giữ bực bội trong lòng lâu ngày. Chuẩn bị phương án dự phòng cho chuyện bất ngờ.',
    'Hóa Kỵ': 'Nói rõ, viết rõ để tránh hiểu lầm. Việc gì đang vướng thì tìm gốc rễ để gỡ thay vì né tránh.',
    'Thái Tuế': 'Cẩn trọng lời nói, tránh bàn chuyện người khác. Giấy tờ, cam kết nên rõ ràng.',
    'Tang Môn': 'Dành thời gian cho gia đình, người lớn tuổi. Khi buồn nên chia sẻ thay vì giữ một mình.',
    'Quan Phù': 'Giấy tờ, hợp đồng, thuế phí làm đúng hạn và đúng luật. Có tranh chấp thì hỏi người có chuyên môn.',
    'Tử Phù': 'Nghỉ ngơi đúng lúc, đừng để mệt mỏi tích lại. Giữ tinh thần thư thái.',
    'Tuế Phá': 'Tránh đổi việc, đổi chỗ khi chưa chuẩn bị xong. Giữ gìn đồ đạc và các mối quan hệ cũ.',
    'Bạch Hổ': 'Cẩn thận khi đi lại, vận động mạnh. Tránh tranh chấp gay gắt; có việc thì giải quyết qua giấy tờ.',
    'Điếu Khách': 'Giữ liên lạc với người thân ở xa. Tin không vui đến thì bình tĩnh xử lý từng việc.',
    'Trực Phù': 'Gặp cản trở thì tìm đường vòng thay vì đối đầu. Kiên nhẫn chờ thời điểm thuận hơn.',
    'Tiểu Hao': 'Ghi chép chi tiêu hằng ngày, bớt mua sắm theo hứng. Khoản nhỏ cộng lại cũng thành lớn.',
    'Đại Hao': 'Lập ngân sách cho các khoản lớn, so sánh kỹ trước khi chi. Luôn giữ một quỹ dự phòng.',
    'Tướng Quân': 'Có uy thì càng nên mềm mỏng. Quyết việc lớn sau khi đã nghe đủ các bên.',
    'Phi Liêm': 'Không vội tin tin đồn, kiểm chứng trước khi phản ứng. Cẩn thận lời nói trên mạng.',
    'Bệnh Phù': 'Ăn ngủ điều độ, khám sức khỏe định kỳ. Đừng cố làm khi cơ thể đã báo mệt.',
    'Phục Binh': 'Giữ kín kế hoạch khi chưa xong. Chọn người đáng tin để hợp tác và thỏa thuận rõ ràng từ đầu.',
    'Quan Phủ': 'Làm việc với cơ quan, giấy tờ thì chuẩn bị đủ hồ sơ. Tránh đi đường tắt.',
    'Thiên Không': 'Đặt mục tiêu vừa sức và chia nhỏ từng bước. Đừng hứa trước khi chắc làm được.',
    'Thiên Hình': 'Nghiêm với mình, bao dung với người. Chú ý an toàn lao động và giao thông.',
    'Thiên Riêu': 'Giữ ranh giới rõ ràng trong tình cảm. Tránh những cuộc vui kéo dài, chi tiêu theo cảm xúc.',
    'Thiên Khốc': 'Viết ra hoặc nói ra nỗi lo thay vì ôm trong lòng. Giữ nếp sinh hoạt đều đặn.',
    'Thiên Hư': 'Tìm việc có ý nghĩa để làm và người để chia sẻ. Ra ngoài, vận động nhiều hơn.',
    'Cô Thần': 'Chủ động giữ liên lạc với người thân, bạn bè. Tham gia một nhóm sinh hoạt chung.',
    'Quả Tú': 'Tập chia sẻ suy nghĩ với người gần gũi. Đừng ngại nhờ giúp khi cần.',
    'Thiên Thương': 'Cẩn thận chi tiêu và giữ sức khỏe trong giai đoạn này. Việc lớn nên lùi lại cân nhắc thêm.',
    'Thiên Sứ': 'Chuẩn bị phương án dự phòng cho việc quan trọng. Giữ bình tĩnh khi có tin không vui.',
    'Thiên La': 'Gỡ từng nút một, việc nào xong việc đó. Tránh nhận thêm ràng buộc mới khi việc cũ chưa xong.',
    'Địa Võng': 'Đọc kỹ điều khoản trước khi cam kết. Đừng nhận lời khi chưa rõ trách nhiệm của mình.',
    'Lưu Hà': 'Cẩn thận khi đi sông nước, bơi lội và khi lái xe. Dùng đồ bảo hộ khi làm việc nguy hiểm.',
    'Kiếp Sát': 'Cất giữ tài sản cẩn thận, cảnh giác với lừa đảo. Đi lại chú ý an toàn.',
    'Phá Toái': 'Bảo quản đồ đạc, máy móc. Trong quan hệ tránh lời nói làm tổn thương người khác.',
    'Đẩu Quân': 'Nghiêm khắc vừa phải với mình và người. Dành thời gian gần gũi người thân để bớt cô độc.',
  };

  // Điểm xấu trong phần Tổng quan
  const TONG = {
    satNhieu: 'Chọn con đường bền bỉ thay vì đi tắt, xây vài mối quan hệ tin cậy làm chỗ dựa, và luôn có kế hoạch dự phòng.',
    tuanTrietMenh: 'Thời trẻ chậm thì lấy học hỏi làm vốn. Đừng so mình với người khác; kết quả thường đến muộn mà bền.',
    'Cục khắc Bản Mệnh': 'Giữ sức khỏe, nhịp sống đều, và chọn môi trường hợp với mình thay vì cố chịu đựng áp lực kéo dài.',
    'Âm dương nghịch lý': 'Chuẩn bị kỹ và kiên trì hơn người một chút; đừng nản khi kết quả đến chậm.',
  };

  // So sánh hai lá số: những điểm "kỵ"
  const SO_SANH = {
    nguHanhKhac: 'Hành khắc nhau thường được hiểu là nhịp sống, cách nghĩ khác nhau. Nên thống nhất trước những việc lớn (tiền bạc, nơi ở, con cái) và chia rõ ai lo việc gì.',
    canXung: 'Can xung hay được hiểu là dễ bất đồng ý kiến. Khi tranh luận, nói về việc chứ không nói về người, và hẹn lúc bình tĩnh để bàn tiếp.',
    chiXung: 'Chi xung hay được hiểu là tính cách trái chiều. Cái khác nhau có thể bù cho nhau nếu mỗi người nhường một phần và tôn trọng khoảng riêng của nhau.',
    chiHai: 'Lục hại thường được hiểu là dễ hiểu lầm vì chuyện nhỏ. Nên nói thẳng điều mình cần, đừng để bực bội tích lại.',
    menhXung: 'Hai cung Mệnh đối nhau: góc nhìn ngược chiều, dễ bổ sung cho nhau trong công việc nhưng cần kiên nhẫn trong đời sống chung.',
  };

  return { CACH, PHA, CHINH_HAM, SAO, TONG, SO_SANH };
})();
if (typeof module !== 'undefined') module.exports = TuViLoiKhuyen;
