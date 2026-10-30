// Nội dung luận giải cơ bản — tự biên soạn, mang tính tham khảo.
const TuViContent = (() => {
  const CUNG_Y = {
    'Mệnh': 'Bản thân: tính cách, năng lực, khí chất và hướng đi chung của đời người.',
    'Phụ Mẫu': 'Cha mẹ, người trên, sự che chở từ bề trên và mối quan hệ với cấp trên.',
    'Phúc Đức': 'Phúc phần dòng họ, đời sống tinh thần, sự an vui và tuổi thọ.',
    'Điền Trạch': 'Nhà cửa, đất đai, tài sản cố định và không khí gia đình.',
    'Quan Lộc': 'Công danh, sự nghiệp, cách làm việc và vị trí trong xã hội.',
    'Nô Bộc': 'Bạn bè, đồng nghiệp, cấp dưới và người giúp việc.',
    'Thiên Di': 'Ra ngoài, đi xa, cơ hội ở môi trường bên ngoài và cách người khác nhìn mình.',
    'Tật Ách': 'Sức khỏe, bệnh tật và những trở ngại bất ngờ.',
    'Tài Bạch': 'Tiền bạc, cách kiếm tiền và cách giữ của.',
    'Tử Tức': 'Con cái, học trò và sự nối tiếp.',
    'Phu Thê': 'Hôn nhân, người phối ngẫu và chuyện tình cảm.',
    'Huynh Đệ': 'Anh chị em, người ngang hàng thân thiết.',
  };

  // [tính chất chung, khi sáng (miếu/vượng/đắc), khi hãm]
  const CHINH = {
    'Tử Vi': ['Đế tinh, chủ về uy quyền, lòng tự trọng và khả năng lãnh đạo.', 'đứng đắn, có tầm nhìn, dễ được người nâng đỡ', 'tự cao, độc đoán, thích được tâng bốc; người quanh mình nể ngoài mặt nhưng ít ai giúp thật lòng, làm việc lớn dễ hụt hơi'],
    'Thiên Cơ': ['Mưu tinh, chủ về trí tuệ, tính toán và sự linh hoạt.', 'nhanh nhạy, khéo xoay xở, giỏi lập kế hoạch', 'lo nghĩ quá mức, thay đổi liên tục, tính nhiều làm ít; mưu tính quá sâu dễ làm mất lòng người'],
    'Thái Dương': ['Quý tinh, chủ về danh tiếng, sự rộng rãi và hình ảnh người cha.', 'thẳng thắn, hào phóng, có tiếng tăm', 'vất vả vì người khác mà ít được đền đáp, danh lớn hơn lợi, tiền làm ra khó giữ; thường thiếu sự nâng đỡ của cha hoặc bề trên'],
    'Vũ Khúc': ['Tài tinh, chủ về tiền bạc, ý chí và tính quyết đoán.', 'kiên định, giỏi quản lý tài chính', 'cứng nhắc, khô khan, cô độc; tiền bạc lên xuống thất thường, dễ thất bại vì quyết định liều'],
    'Thiên Đồng': ['Phúc tinh, chủ về sự hiền hòa, hưởng thụ và khả năng hóa giải.', 'ôn hòa, dễ gần, được hưởng phúc', 'thiếu ý chí, ham vui, hay trì hoãn; gặp khó dễ bỏ cuộc, đời trôi theo hoàn cảnh hơn là tự làm chủ'],
    'Liêm Trinh': ['Tù tinh, chủ về nguyên tắc, kỷ luật và ham muốn.', 'chính trực, có nguyên tắc, làm việc nghiêm túc', 'nóng nảy, cố chấp, ham muốn quá đà; dễ vướng thị phi, kiện tụng hoặc rắc rối tình cảm'],
    'Thiên Phủ': ['Tài khố tinh, chủ về sự ổn định, tích lũy và độ lượng.', 'chắc chắn, biết giữ của, có uy tín', 'bảo thủ, chặt chẽ quá thành keo kiệt, ngại thay đổi; giữ của mà không làm của sinh sôi, để lỡ cơ hội vì quá thận trọng'],
    'Thái Âm': ['Phú tinh, chủ về điền sản, sự dịu dàng và hình ảnh người mẹ.', 'tinh tế, có của để dành, giàu cảm xúc', 'đa sầu, nhạy cảm quá mức, hay tủi thân; tài sản khó bền, tình cảm nhiều nỗi buồn'],
    'Tham Lang': ['Đào hoa tinh, chủ về ham muốn, giao tiếp và tài nghệ.', 'đa tài, giao thiệp rộng, có duyên', 'ham vui, dễ sa vào rượu chè, cờ bạc hoặc tình ái, thiếu kiên trì; hao tiền và mang tiếng vì quan hệ phức tạp'],
    'Cự Môn': ['Ám tinh, chủ về ăn nói, tranh luận và sự nghi ngờ.', 'giỏi lý luận, hợp nghề nói và phân tích', 'nói nhiều thành thị phi, hay nghi ngờ người khác; dễ kiện tụng, khẩu thiệt, quan hệ đổ vỡ vì lời nói'],
    'Thiên Tướng': ['Ấn tinh, chủ về sự công bằng, phục vụ và giúp người.', 'đáng tin, chu đáo, có khiếu tổ chức', 'dễ bị lợi dụng, gánh việc và gánh nợ cho người khác; thiếu chính kiến, hay chịu thiệt'],
    'Thiên Lương': ['Ấm tinh, chủ về sự che chở, đạo đức và tuổi thọ.', 'nhân hậu, thích giúp người, gặp nạn có cứu', 'cố chấp, thích dạy đời, hay xen vào chuyện người khác; dễ bị cho là khó gần, nói hay hơn làm'],
    'Thất Sát': ['Tướng tinh, chủ về sự dũng mãnh, thay đổi và mạo hiểm.', 'gan dạ, dám làm, tạo dựng từ hai bàn tay', 'nóng vội, liều lĩnh, cô độc; đời biến động lớn, dễ thất bại nặng hoặc gặp tai nạn vì quyết định vội'],
    'Phá Quân': ['Hao tinh, chủ về phá cũ lập mới và tiêu hao.', 'dám đổi mới, có sức bật, hợp khai phá', 'bốc đồng, phá nhiều hơn xây, hao tán tiền bạc; công việc, quan hệ, hôn nhân dễ đổ vỡ'],
  };

  const PHU = {
    'Lộc Tồn': 'Giữ của, tích lũy, cẩn trọng.', 'Hóa Lộc': 'Tài lộc, sự thuận lợi và cơ hội.', 'Hóa Quyền': 'Quyền hành, khả năng nắm việc.',
    'Hóa Khoa': 'Học vấn, danh tiếng tốt, gặp quý nhân.', 'Hóa Kỵ': 'Vướng mắc, thị phi, điều khiến lo nghĩ.',
    'Văn Xương': 'Văn chương, học hành, thi cử.', 'Văn Khúc': 'Tài ăn nói, nghệ thuật, khéo léo.',
    'Thiên Khôi': 'Quý nhân dương, được nâng đỡ.', 'Thiên Việt': 'Quý nhân âm, được giúp ngầm.',
    'Tả Phù': 'Trợ lực, có người phụ giúp.', 'Hữu Bật': 'Trợ lực, được hậu thuẫn.',
    'Thiên Mã': 'Di chuyển, thay đổi, năng động.', 'Bác Sĩ': 'Thông minh, học rộng.', 'Lực Sĩ': 'Sức mạnh, quyền lực.',
    'Thanh Long': 'Vui mừng, may mắn.', 'Tấu Thư': 'Giấy tờ, văn thư, tin tức.', 'Hỷ Thần': 'Tin vui, hỷ sự.',
    'Thiếu Dương': 'Thông minh, vui vẻ.', 'Thiếu Âm': 'Hiền hòa, kín đáo.', 'Long Đức': 'Phúc đức, giải hạn nhẹ.',
    'Phúc Đức': 'Phúc thiện, được che chở.', 'Long Trì': 'Khoa bảng, thanh nhã.', 'Phượng Các': 'Danh tiếng, khoa bảng.',
    'Giải Thần': 'Hóa giải tai ách.', 'Tam Thai': 'Địa vị, chức vụ.', 'Bát Tọa': 'Địa vị, được trọng vọng.',
    'Ân Quang': 'Được ơn, được ban thưởng.', 'Thiên Quý': 'Được quý mến, giúp đỡ.', 'Thiên Quan': 'Quý hiển, được đề bạt.',
    'Thiên Phúc': 'Phúc lộc, tín ngưỡng.', 'Thiên Đức': 'Đức độ, giải ách.', 'Nguyệt Đức': 'Hiền hậu, giải ách.',
    'Thiên Hỷ': 'Vui mừng, cưới hỏi.', 'Hồng Loan': 'Tình duyên, hôn nhân.', 'Đào Hoa': 'Duyên dáng, tình cảm.',
    'Thiên Tài': 'Tài năng riêng.', 'Thiên Thọ': 'Sống thọ, điềm đạm.', 'Thai Phụ': 'Danh dự, chức tước.', 'Phong Cáo': 'Bằng sắc, khen thưởng.',
    'Quốc Ấn': 'Ấn tín, chức quyền.', 'Đường Phù': 'Địa vị, xe cộ, nhà cửa.', 'Văn Tinh': 'Văn học, khoa cử.',
    'Thiên Giải': 'Giải trừ tai họa.', 'Địa Giải': 'Giải trừ tai họa.', 'Thiên Y': 'Y dược, chữa lành.', 'Thiên Trù': 'Ăn uống, bếp núc, lộc ăn.',
    'Hoa Cái': 'Phong cách, thích làm đẹp, tôn giáo.',
    'Kình Dương': 'Sát tinh: quyết liệt, dễ va chạm, tai nạn.', 'Đà La': 'Sát tinh: chậm trễ, dây dưa, khó dứt.',
    'Địa Không': 'Sát tinh: hư không, mất mát bất ngờ, ý tưởng lạ.', 'Địa Kiếp': 'Sát tinh: phá tán, biến cố.',
    'Hỏa Tinh': 'Sát tinh: nóng nảy, bùng phát nhanh.', 'Linh Tinh': 'Sát tinh: âm ỉ, bất ngờ.',
    'Thái Tuế': 'Thị phi, lời nói, kiện cáo.', 'Tang Môn': 'Buồn phiền, tang chế.', 'Quan Phù': 'Kiện tụng, giấy tờ pháp lý.',
    'Tử Phù': 'Ưu phiền, bệnh nhẹ.', 'Tuế Phá': 'Hao tổn, phá vỡ.', 'Bạch Hổ': 'Tai nạn, kiện tụng, mạnh mẽ.',
    'Điếu Khách': 'Buồn phiền, khách đến báo tin không vui.', 'Trực Phù': 'Trở ngại, ngăn cản.', 'Quan Phủ': 'Chuyện quan quyền, giấy tờ.',
    'Tiểu Hao': 'Hao tốn nhỏ.', 'Đại Hao': 'Hao tốn lớn.', 'Tướng Quân': 'Uy dũng nhưng nóng vội.', 'Phi Liêm': 'Nhanh, thị phi bay đến.',
    'Bệnh Phù': 'Ốm đau, mệt mỏi.', 'Phục Binh': 'Ám hại ngầm, bị chơi xấu.', 'Thiên Không': 'Hư hao, mưu tính khó thành.',
    'Thiên Hình': 'Hình phạt, kỷ luật, phẫu thuật.', 'Thiên Riêu': 'Đa tình, mê đắm.', 'Thiên Khốc': 'Buồn khóc, lo âu.', 'Thiên Hư': 'Trống rỗng, buồn vu vơ.',
    'Cô Thần': 'Cô đơn, ít gần người thân.', 'Quả Tú': 'Lẻ loi, khó chia sẻ.', 'Thiên Thương': 'Hao tổn, buồn rầu.', 'Thiên Sứ': 'Tai ương, lo âu.',
    'Thiên La': 'Ràng buộc, vướng mắc.', 'Địa Võng': 'Ràng buộc, vướng mắc.', 'Lưu Hà': 'Tai nạn sông nước, máu huyết.',
    'Kiếp Sát': 'Tai nạn, mất mát.', 'Phá Toái': 'Đổ vỡ, phá hỏng.', 'Đẩu Quân': 'Nghiêm khắc, cô độc.',
  };

  const LUC_CAT = ['Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt', 'Tả Phù', 'Hữu Bật'];
  const LUC_SAT = ['Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp', 'Hỏa Tinh', 'Linh Tinh'];
  const BRIGHT_TEN = { M: 'miếu', V: 'vượng', 'Đ': 'đắc', B: 'bình hòa', H: 'hãm' };

  const AM_DUONG_Y = {
    'Âm dương thuận lý': 'Âm dương của tuổi và của cung Mệnh cùng loại, thường được xem là thuận, làm việc ít gặp cản trở từ gốc.',
    'Âm dương nghịch lý': 'Âm dương của tuổi và của cung Mệnh khác loại, thường được xem là phải nỗ lực nhiều hơn mới thành.',
  };
  const MENH_CUC_Y = {
    'Bản Mệnh sinh Cục': 'Mệnh sinh Cục: hay dồn sức cho hoàn cảnh, làm nhiều mới hưởng.',
    'Cục sinh Bản Mệnh': 'Cục sinh Mệnh: hoàn cảnh nâng đỡ bản thân, được xem là tốt.',
    'Bản Mệnh khắc Cục': 'Mệnh khắc Cục: tự chủ cao, phải chế ngự hoàn cảnh mới thành.',
    'Cục khắc Bản Mệnh': 'Cục khắc Mệnh: hoàn cảnh hay gây áp lực, cần giữ sức bền.',
    'Mệnh Cục bình hòa': 'Mệnh và Cục cùng hành: ổn định, ít xung đột với hoàn cảnh.',
  };

  const THAN_CU = { 'Mệnh': 'chính bản thân, tự lập', 'Phúc Đức': 'phúc phần và đời sống tinh thần', 'Quan Lộc': 'công danh, sự nghiệp', 'Thiên Di': 'việc ra ngoài, đi xa', 'Tài Bạch': 'chuyện tiền bạc', 'Phu Thê': 'gia đình, vợ chồng' };
  // Giải thích ngắn cho nút (i)
  const INFO = {
    docDung: ['Đọc lá số thế nào cho đúng', 'Lá số được tính chính xác theo quy tắc an sao, nhưng phần luận giải là diễn giải truyền thống, chưa có nghiên cứu khoa học nào cho thấy nó dự đoán được tính cách hay vận mệnh. Nhiều câu như "hay lo nghĩ", "thích được tôn trọng" đúng với hầu hết mọi người, nên ai đọc cũng dễ thấy "trúng" (gọi là hiệu ứng Barnum). Hãy đọc cả điểm tốt lẫn điểm xấu như gợi ý để tự soi xét, đừng dùng để quyết định hôn nhân, tiền bạc, sức khỏe hay việc lớn.'],
    luuNien: ['Sao lưu niên', 'Các sao có chữ L. đứng trước là sao của riêng năm đang xem, an theo can chi của năm đó. Dùng để xem vận trong năm, không thay đổi lá số gốc.'],
    daiVan: ['Sao lưu đại hạn', 'Các sao có chữ ĐV. đứng trước là sao của riêng đại hạn (10 năm) đang chạy: Tứ hóa, Lộc Tồn, Kình Dương, Đà La an theo can của cung đại hạn; Thiên Mã theo chi của cung đó. Các trường phái còn khác nhau về bộ sao này (có nơi thêm Khôi, Việt, Xương, Khúc; có nơi chỉ dùng Tứ hóa).'],
    tamPhuong: ['Đường tam phương', 'Nối cung đang chọn với hai cung tam hợp (cách 4 cung, đường liền) và cung xung chiếu (đối diện, đường đứt). Bốn cung này cùng chi phối cung đang xem.'],
    timSao: ['Tìm sao', 'Gõ tên một sao, chọn trong danh sách gợi ý, web sẽ nhảy tới cung có sao đó và tô sáng nó.'],
    doSang: ['Độ sáng của sao', 'Cho biết sao đứng ở cung hợp hay không. Miếu và Vượng mạnh nhất, Đắc là tốt, Bình hòa trung tính, Hãm là yếu hoặc dễ gây xấu.'],
    amDuongDau: ['Dấu + và –', 'Dấu + là dương, dấu – là âm. Dấu trước tên cung là âm dương của cung; dấu trước chính tinh là âm dương của sao. Tên cung được tô theo ngũ hành của cung.'],
    nguHanh: ['Màu ngũ hành', 'Mỗi sao và mỗi cung thuộc một hành: Kim xám, Mộc xanh, Thủy mực đậm, Hỏa đỏ, Thổ vàng cam.'],
    tuanTriet: ['Tuần và Triệt', 'Hai vùng không vong nằm trên vạch giữa hai cung. Sao tốt trong đó giảm lực, sao xấu bớt hại. Triệt nặng ở tuổi trẻ, Tuần ảnh hưởng về sau.'],
    oCung: ['Chữ nhỏ trong mỗi cung', 'Góc trên trái là âm dương và can chi của cung. Số góc trên phải là tuổi bắt đầu đại hạn, T. là tháng âm lịch của năm xem. Dưới cùng: ĐV. là tên cung trong đại vận đang chạy, giữa là vòng Tràng Sinh, LN. là tên cung trong năm xem. Chữ chi ở viền thiên bàn là năm có tiểu hạn rơi vào cung kề bên.'],
    daiHan: ['Đại hạn', 'Mỗi đại hạn kéo dài 10 năm, đi qua lần lượt từng cung bắt đầu từ Mệnh. Số ở góc cung là tuổi âm bắt đầu đại hạn tại cung đó.'],
    tieuHan: ['Tiểu hạn', 'Mỗi năm một cung. Cung tiểu hạn của năm xem cho biết chuyện nổi bật trong năm đó.'],
    trangSinh: ['Vòng Tràng Sinh', '12 giai đoạn từ Tràng Sinh đến Dưỡng, khởi theo Cục. Cho biết sức sống của cung, như vòng đời của một mầm cây.'],
    menh: ['Bản mệnh', 'Ngũ hành nạp âm của năm sinh, ví dụ Thành Đầu Thổ là đất trên thành.'],
    cuc: ['Cục', 'Ngũ hành nạp âm của cung Mệnh. Cục quyết định vị trí sao Tử Vi và tuổi bắt đầu đại hạn đầu tiên. Quan hệ sinh khắc giữa Mệnh và Cục cho biết hoàn cảnh nâng đỡ hay gây áp lực.'],
    amDuongLy: ['Âm dương thuận lý', 'So âm dương của tuổi với âm dương của cung Mệnh. Cùng loại là thuận lý, khác loại là nghịch lý.'],
    menhChu: ['Mệnh chủ', 'Sao chủ của cung Mệnh, tra theo chi năm sinh. Sao này mạnh thì bản mệnh vững.'],
    thanChu: ['Thân chủ', 'Sao chủ của Thân, tra theo chi năm sinh, ảnh hưởng nhiều từ khoảng 30 tuổi trở đi.'],
    canLuong: ['Cân lượng', 'Phép cân xương đoán số: cộng trọng lượng của năm, tháng, ngày, giờ sinh âm lịch. 10 chỉ bằng 1 lượng; càng nặng thường được xem là phúc dày.'],
    laiNhan: ['Lai nhân cung', 'Cung có thiên can trùng với can năm sinh (không tính Tý, Sửu). Được xem là việc mình mang theo vào đời này và thường bận tâm nhiều.'],
    thanCu: ['Thân cư', 'Cung mà Thân đóng. Mệnh nói về bản chất, Thân nói về nửa đời sau và nơi mình dồn sức.'],
    catTinh: ['Cát tinh', 'Sao tốt, mang lại thuận lợi, quý nhân, tài lộc. Bấm vào từng sao để xem nghĩa.'],
    hungTinh: ['Hung tinh', 'Sao xấu hoặc gây trở ngại. Ở cung hợp hoặc gặp sao giải thì bớt hại. Bấm vào từng sao để xem nghĩa.'],
    vcd: ['Vô chính diệu', 'Cung không có chính tinh nào trong 14 chính tinh. Khi luận, mượn chính tinh của cung xung chiếu.'],
    namXem: ['Năm xem hạn', 'Năm dùng để tính tuổi, đại hạn, tiểu hạn, tháng âm và sao lưu niên. Mặc định là năm nay.'],
    gioDongHo: ['Giờ đồng hồ lúc sinh', 'Miền Bắc dùng giờ UTC+8 đến 08/1967, miền Nam đến 1975. Chọn UTC+8 nếu giờ sinh ghi theo đồng hồ thời đó; web tự đổi về giờ Việt Nam.'],
    gioTy: ['Giờ Tý sớm và muộn', 'Giờ Tý từ 23 giờ đến 1 giờ sáng. Tý muộn (23 đến 24 giờ) mặc định tính sang ngày hôm sau; có thể đổi trong Tùy chọn trường phái.'],
    // Thần số học
    tshChiSo: ['Cách tính các chỉ số', 'Số chủ đạo cộng mọi chữ số của ngày sinh dương lịch. Các số từ tên đổi chữ cái thành số theo bảng Pythagoras (A, J, S = 1; B, K, T = 2; …; I, R = 9): linh hồn cộng nguyên âm, nhân cách cộng phụ âm, sứ mệnh cộng tất cả. Rút gọn đến một chữ số, riêng 11, 22, 33 là số bậc thầy được giữ lại.'],
    tshLuoi: ['Biểu đồ và mũi tên', 'Các chữ số của ngày sinh (bỏ số 0) được xếp vào lưới 3×3: cột trái 1-2-3, giữa 4-5-6, phải 7-8-9 (từ dưới lên). Hàng, cột hay đường chéo có đủ số là mũi tên sức mạnh; trống hẳn là điểm cần rèn. Biểu đồ tên đếm các chữ cái theo số.'],
    tshNam: ['Năm cá nhân', 'Cộng ngày, tháng sinh với năm đang xem rồi rút gọn còn 1–9. Mỗi 9 năm là một chu kỳ: năm 1 khởi đầu, năm 9 khép lại. Tháng cá nhân bằng năm cá nhân cộng số tháng.'],
    // Bản đồ sao
    bdsNoiSinh: ['Nơi sinh', 'Cần để tính Điểm Mọc và 12 nhà. Chọn tỉnh, thành theo tên cũ (trước sáp nhập 2025); tọa độ lấy ở trung tâm tỉnh lỵ nên Điểm Mọc có thể lệch khoảng 1 độ. Sinh ở huyện xa tỉnh lỵ hoặc ở nước ngoài thì chọn "Nơi khác" và nhập tọa độ, múi giờ.'],
    bdsVong: ['Cách đọc vòng bản đồ sao', 'Vòng ngoài là 12 cung hoàng đạo. Vòng giữa đánh số 12 nhà, bắt đầu từ Điểm Mọc (AC) bên trái, đi ngược chiều kim đồng hồ. Ký hiệu bên trong là hành tinh, chữ R là đang nghịch hành. Đường nối giữa vòng là góc chiếu: xanh là hài hòa, đỏ là căng thẳng, vàng là trùng tụ.'],
    bdsCung: ['Cung hoàng đạo', '12 phần, mỗi phần 30 độ của đường đi biểu kiến của Mặt Trời, tính từ điểm xuân phân (hoàng đạo nhiệt đới). Cung cho biết hành tinh thể hiện theo phong cách nào.'],
    bdsNha: ['12 nhà', '12 lĩnh vực của đời sống, chia theo bầu trời lúc bạn sinh ra (hệ Placidus). Nhà cho biết năng lượng của hành tinh dồn vào lĩnh vực nào. Cần giờ và nơi sinh chính xác.'],
    bdsMoc: ['Điểm Mọc và Thiên Đỉnh', 'Điểm Mọc (AC) là cung đang mọc ở chân trời phía đông lúc bạn sinh, ứng với vẻ ngoài và cách bạn bắt đầu mọi việc. Thiên Đỉnh (MC) là điểm cao nhất trên bầu trời, ứng với sự nghiệp. Điểm Mọc đổi khoảng 1 độ mỗi 4 phút, nên cần giờ sinh chính xác.'],
    bdsGoc: ['Góc chiếu', 'Góc giữa hai hành tinh trên vòng hoàng đạo: trùng tụ 0°, lục hợp 60°, vuông góc 90°, tam hợp 120°, đối đỉnh 180°, cho phép lệch vài độ. Góc hài hòa giúp hai năng lượng phối hợp, góc căng tạo áp lực nhưng cũng là động lực.'],
    bdsNghich: ['Nghịch hành (R)', 'Nhìn từ Trái Đất, hành tinh có lúc như đi lùi trên bầu trời. Theo chiêm tinh, năng lượng của hành tinh đó hướng vào trong hơn, thể hiện chậm hoặc theo cách riêng.'],
    bdsPham: ['Đắc, vượng, hãm, tuyệt', 'Mức thuận lợi của hành tinh trong cung: Đắc địa (nhà riêng), Vượng địa (được tôn vinh) là mạnh; Hãm địa (đối nhà riêng), Tuyệt địa (đối chỗ vượng) là yếu.'],
    bdsNguyenTo: ['Nguyên tố và thể', 'Đếm các hành tinh và Điểm Mọc theo 4 nguyên tố (Lửa, Đất, Khí, Nước) và 3 thể (Thống lĩnh, Cố định, Biến đổi) để thấy khí chất nổi trội và phần còn thiếu.'],
    // Bát Tự
    btNhatChu: ['Nhật chủ', 'Thiên can của trụ ngày, đại diện cho chính bạn. Mọi thập thần trên lá số đều tính theo quan hệ ngũ hành, âm dương với nhật chủ.'],
    btThapThan: ['Thập thần', 'Mười quan hệ giữa nhật chủ với các can khác: cùng hành (Tỷ Kiên, Kiếp Tài), ta sinh (Thực Thần, Thương Quan), ta khắc (Thiên Tài, Chính Tài), khắc ta (Thất Sát, Chính Quan), sinh ta (Thiên Ấn, Chính Ấn). Cùng âm dương gọi là "thiên", khác âm dương là "chính". Bấm vào một thập thần trong bảng để xem nghĩa.'],
    btTangCan: ['Tàng can', 'Các thiên can ẩn trong mỗi địa chi. Can đầu là bản khí (mạnh nhất), sau là trung khí và dư khí. Chữ nhỏ bên cạnh là thập thần viết tắt.'],
    btTruongSinh: ['Vòng Trường Sinh', 'Mười hai giai đoạn sức mạnh của nhật chủ khi đứng ở từng địa chi: Trường Sinh, Lâm Quan, Đế Vượng là mạnh; Bệnh, Tử, Tuyệt là yếu. Can dương đi thuận, can âm đi nghịch.'],
    btNapAm: ['Nạp âm', 'Ngũ hành nạp âm của từng cặp can chi trong 60 Hoa Giáp, ví dụ Mậu Dần là Thành Đầu Thổ (đất trên thành).'],
    btThanSat: ['Thần sát', 'Các sao tốt xấu tra theo can ngày và chi ngày. Chỉ là yếu tố phụ, không quyết định cả lá số. Bấm vào tên sao trong bảng để xem nghĩa.'],
    btThai: ['Thai nguyên và Mệnh cung', 'Thai nguyên lấy can tháng cộng 1, chi tháng cộng 3, chỉ khoảng thời điểm thụ thai. Mệnh cung tính từ tháng (theo trung khí) và giờ sinh, tương tự cung Mệnh của Tử Vi.'],
    btTiet: ['Tiết khí và trụ tháng', 'Bát Tự không dùng tháng âm lịch mà dùng 12 tiết: tháng Dần bắt đầu ở Lập Xuân, tháng Mão ở Kinh Trập, và cứ thế. Trụ năm cũng đổi ở Lập Xuân (khoảng 4/2), không phải ở Tết.'],
    btDaiVan: ['Đại vận', 'Mỗi đại vận 10 năm, đi từ trụ tháng: nam năm dương, nữ năm âm đi thuận; còn lại đi nghịch. Số ngày từ lúc sinh tới tiết gần nhất (theo chiều đi) chia 3 ra tuổi khởi vận. Bấm một đại vận để xem 10 năm của nó.'],
    btNguHanh: ['Điểm ngũ hành', 'Mỗi thiên can tính 1 điểm; mỗi địa chi 1 điểm chia theo tàng can (bản khí nhiều nhất). Nhãn dưới mỗi hành cho biết hành đó là nhóm thập thần nào với nhật chủ.'],
    btManh: ['Nhật chủ mạnh yếu', 'Ước lượng đơn giản: so phần trợ giúp nhật chủ (cùng hành và hành sinh ra nhật chủ, cộng thêm nếu được lệnh tháng) với phần còn lại. Không thay cho việc định dụng thần của người có chuyên môn.'],
    btLuuNien: ['Lưu niên', 'Can chi của từng năm, xét quan hệ với nhật chủ (thập thần) và với chi ngày (xung, hợp, hại). Bấm một năm trong dải năm để đổi năm xem.'],
    truongPhai: ['Tùy chọn trường phái', 'Các phái Tử Vi an một vài sao khác nhau. Mặc định theo cách phổ biến ở Việt Nam; chỉ đổi khi bạn theo một sách hoặc thầy cụ thể.'],
  };
  return { INFO, THAN_CU, CUNG_Y, CHINH, PHU, LUC_CAT, LUC_SAT, BRIGHT_TEN, AM_DUONG_Y, MENH_CUC_Y };
})();
if (typeof module !== 'undefined') module.exports = TuViContent;
