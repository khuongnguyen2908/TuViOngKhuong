# Việc còn nợ và cần làm

Cập nhật 30/10/2026. Đánh dấu `[x]` khi xong.

## Độ chính xác (cần người am hiểu Tử Vi xác nhận)

- [ ] **Lưu Hà**: web, aituvi, lasotuvi đặt ở Tỵ cho tuổi Mậu; tracuutuvi đặt ở Tý. Cần bảng đầy đủ của cách tracuutuvi để thêm thành tùy chọn.
- [ ] **Cân lượng**: bảng cân xương đang dùng mới đối chiếu đúng một lá số (Mậu Dần, tháng 7, ngày 8, giờ Thân = 4 lượng 1 chỉ). Cần đối chiếu thêm vài lá số.
- [ ] **Màu ngũ hành 3 sao** đang lệch giữa các trang: Tam Thai, Thai Phụ, Hóa Quyền. Chốt theo một sách.
- [ ] **Độ sáng phụ tinh**: Hóa Lộc (H) chỉ tracuutuvi có; Bạch Hổ, Thiên Khốc, Thiên Hư (H) chỉ aituvi có. Chốt bảng.
- [ ] **Chốt mặc định các tùy chọn trường phái**: Tứ hóa năm Canh, Khoa năm Nhâm, Hỏa Linh tuổi Tỵ Dậu Sửu, Khôi Việt năm Canh, Tràng Sinh Thổ cục, tháng nhuận, giờ Tý muộn.
- [ ] **Bộ sao lưu đại hạn (ĐV.)**: đang dùng Tứ hóa + Lộc Tồn, Kình Dương, Đà La theo can cung đại hạn, Thiên Mã theo chi cung đại hạn. Có trang thêm Khôi, Việt, Xương, Khúc; có trang chỉ dùng Tứ hóa. Cần đối chiếu một lá số của trang / thầy mình tin.
- [ ] Đối chiếu thêm 5–10 lá số thật của người quen với một trang hoặc thầy mình tin.

## Tính năng (theo thứ tự ưu tiên)

1. [x] **Nhận diện cách cục** (xong 30/10, xem `docs/cach-cuc.md`). Còn: người am hiểu xác nhận 5 điểm ❓ (Nhật Nguyệt tịnh minh, Hùng tú triều viên, Thạch trung ẩn ngọc, Thất Sát ngưỡng đẩu, Vô chính diệu đắc tam không).
2. [x] **Đổi năm xem ngay trên lá số** (xong 30/10): thanh ‹ năm › + Năm nay, dải 10 năm dưới đại hạn, sao lưu đại hạn ĐV. Còn: **cách cục theo đại hạn / lưu niên** (làm sau khi chốt bộ sao ĐV.).
3. [x] **Kho nghĩa sao đầy đủ** (phương án A, xong 30/10). **Chờ chủ dự án / người am hiểu đọc `docs/nghia-sao.md` góp ý.**
   - [x] Đợt 1: 168 ô chính tinh × 12 cung, hiện trong bảng chi tiết cung + Cung Mệnh.
   - [x] Đợt 2: 26 phụ tinh chủ chốt × 4 nhóm cung (Bản thân · Tiền và việc · Người thân, bạn bè · Bên ngoài, sức khỏe) + viết dài 57 phụ tinh còn lại; hiện khi bấm vào sao.
   - Còn bàn: sao mượn ở cung vô chính diệu đang hiện độ sáng của cung gốc (cung xung chiếu); có sách xét lại độ sáng theo cung mượn.
4. [ ] **Ảnh chia sẻ mạng xã hội** tỉ lệ 4:5 và 9:16, có dòng "Ông Khương phán rằng" và tóm tắt Mệnh.
5. [x] **So sánh hai lá số** (xong 30/10): tab So sánh, `src/sosanh.js`. Còn: người am hiểu xác nhận cách chấm hợp / kỵ và bảng "tuổi rơi vào cung" (đang để mức Tham khảo).
6. [x] **Không rõ giờ sinh** (xong 30/10): màn `#12-gio-...`, 13 khung giờ (có Tý muộn), lọc theo buổi.
7. [x] **Lời khuyên cho điểm xấu** (xong 30/10): `src/loikhuyen.js`. Chờ người am hiểu đọc góp ý.
8. [x] **Bát Tự** (xong 30/10): `src/battu.js`, màn `#bat-tu-...`, chọn ở trang chủ. Đã khớp bazi.vn 3 lá số. Còn: đối chiếu thêm lá số sinh sát giờ giao tiết; cách ước lượng nhật chủ mạnh yếu / dụng thần đang đơn giản, cần người am hiểu góp ý; thêm thần sát theo chi năm nếu cần.

## Kỹ thuật

- [ ] Bật Góp ý trên GitHub Pages: deploy `worker/gop-y.mjs` + D1, đặt biến `FEEDBACK_ENDPOINT` (xem README). Cân nhắc bật `DUYET_TRUOC` nếu bị spam.

- [ ] Chọn giấy phép cho mã của dự án (repo **đang công khai** mà chưa có giấy phép).
- [ ] Bật Luận giải AI trên GitHub Pages: deploy `worker/ai-proxy.js`, đặt `ANTHROPIC_API_KEY`, `ALLOWED_ORIGINS`, giới hạn số lần gọi, hạn mức chi tiêu; gọi thử Claude API thật lần đầu (hiện mới thử với dữ liệu giả lập).
- [ ] Chạy `tests/browser/layout-qa.cjs` có font Google thật, và thử trên điện thoại thật (iOS Safari, Android Chrome).
- [ ] Kiểm tra nút Tải ảnh PNG trên trình duyệt thật (chưa thử được vì môi trường kiểm thử chặn CDN).
- [ ] Đóng gói `src/lunar.js` + `src/engine.js` thành gói npm riêng nếu muốn dùng cho app mobile.

## Đã xong gần đây

- [x] Bớt nói giảm (30/10): ghi rõ Tử Vi là diễn giải truyền thống, chưa được khoa học chứng minh (dưới nút An lá số, chân trang, cuối Tổng quan + nút i "Đọc lá số thế nào cho đúng"); thêm 6 hung cách (cát/hung mỗi lá số 1,03 / 0,87, trước 1,05 / 0,48); lời dặn AI nói thẳng điểm xấu, tránh câu chung chung; viết lại 14 câu "khi hãm" của chính tinh. Chưa làm: công tắc ẩn lời khuyên (tách lời khuyên khỏi 272 ô nghĩa sao).

- [x] Đổi năm xem ngay trên lá số: nút ‹ › (bấm giữ để lướt, phím ← →), nút Năm nay, dải 10 năm của đại hạn (bấm đại hạn để mở), link tự cập nhật năm; sao lưu đại hạn ĐV. (công tắc riêng, màu tím) trong cung, bảng chi tiết, AI và JSON.

- [x] Cách cục: 4 bộ chính tinh + 48 cách, nay 54 (cát / hung / biến), phá cách, cách lớn che cách nhỏ, bấm để tô cung trên lá số, gửi kèm AI và JSON.

- [x] Trang đã lên GitHub Pages: https://khuongnguyen2908.github.io/TuViOngKhuong/ (workflow `.github/workflows/pages.yml`: mỗi lần đẩy lên `main` chạy kiểm thử → ghép → đăng).
- [x] Đưa code ra gốc repo (trước nằm trong `tu-vi-ong-khuong/`), thêm `.gitattributes` (xuống dòng LF), `.gitignore`.

- [x] Lịch âm Việt Nam UTC+7, khớp lịch Hồ Ngọc Đức 1900–2199.
- [x] Engine an sao phái Việt, khớp lá số mẫu 12/12 cung và tracuutuvi 96/97 sao.
- [x] Trang chủ lập lá số, nút quay lại, link riêng cho từng lá số.
- [x] Nền sáng/tối, logo bát quái, dấu âm dương, cân lượng, lai nhân, ĐV./LN.
- [x] Nút (i) giải thích; sửa chữ đè; kiểm tra giao diện tự động 40 tổ hợp màn hình.
