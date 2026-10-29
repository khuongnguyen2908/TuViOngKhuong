# Việc còn nợ và cần làm

Cập nhật 30/10/2026. Đánh dấu `[x]` khi xong.

## Độ chính xác (cần người am hiểu Tử Vi xác nhận)

- [ ] **Lưu Hà**: web, aituvi, lasotuvi đặt ở Tỵ cho tuổi Mậu; tracuutuvi đặt ở Tý. Cần bảng đầy đủ của cách tracuutuvi để thêm thành tùy chọn.
- [ ] **Cân lượng**: bảng cân xương đang dùng mới đối chiếu đúng một lá số (Mậu Dần, tháng 7, ngày 8, giờ Thân = 4 lượng 1 chỉ). Cần đối chiếu thêm vài lá số.
- [ ] **Màu ngũ hành 3 sao** đang lệch giữa các trang: Tam Thai, Thai Phụ, Hóa Quyền. Chốt theo một sách.
- [ ] **Độ sáng phụ tinh**: Hóa Lộc (H) chỉ tracuutuvi có; Bạch Hổ, Thiên Khốc, Thiên Hư (H) chỉ aituvi có. Chốt bảng.
- [ ] **Chốt mặc định các tùy chọn trường phái**: Tứ hóa năm Canh, Khoa năm Nhâm, Hỏa Linh tuổi Tỵ Dậu Sửu, Khôi Việt năm Canh, Tràng Sinh Thổ cục, tháng nhuận, giờ Tý muộn.
- [ ] Đối chiếu thêm 5–10 lá số thật của người quen với một trang hoặc thầy mình tin.

## Tính năng (theo thứ tự ưu tiên)

1. [ ] **Nhận diện cách cục**: Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Nhật Nguyệt tịnh minh, Mệnh vô chính diệu đắc tam không, Kình Đà giáp Mệnh… (tham khảo 51 cách cục của TuViMCP, Apache-2.0).
2. [ ] **Đổi năm xem ngay trên lá số**: nút lùi/tới năm, sao lưu niên và tiểu hạn đổi tức thì. Thêm lưu tứ hóa của đại hạn.
3. [ ] **Kho nghĩa sao đầy đủ**: 14 chính tinh × 12 cung, phụ tinh theo cung, viết lời tự biên soạn và ghi nguồn.
4. [ ] **Ảnh chia sẻ mạng xã hội** tỉ lệ 4:5 và 9:16, có dòng "Ông Khương phán rằng" và tóm tắt Mệnh.
5. [ ] **So sánh hai lá số**: hợp tuổi, vợ chồng, đối tác.
6. [ ] **Không rõ giờ sinh**: xem nhanh Mệnh, Thân của cả 12 giờ.

## Kỹ thuật

- [ ] Chọn giấy phép cho mã của dự án (repo **đang công khai** mà chưa có giấy phép).
- [ ] Bật Luận giải AI trên GitHub Pages: deploy `worker/ai-proxy.js`, đặt `ANTHROPIC_API_KEY`, `ALLOWED_ORIGINS`, giới hạn số lần gọi, hạn mức chi tiêu; gọi thử Claude API thật lần đầu (hiện mới thử với dữ liệu giả lập).
- [ ] Chạy `tests/browser/layout-qa.cjs` có font Google thật, và thử trên điện thoại thật (iOS Safari, Android Chrome).
- [ ] Kiểm tra nút Tải ảnh PNG trên trình duyệt thật (chưa thử được vì môi trường kiểm thử chặn CDN).
- [ ] Đóng gói `src/lunar.js` + `src/engine.js` thành gói npm riêng nếu muốn dùng cho app mobile.

## Đã xong gần đây

- [x] Trang đã lên GitHub Pages: https://khuongnguyen2908.github.io/TuViOngKhuong/ (workflow `.github/workflows/pages.yml`: mỗi lần đẩy lên `main` chạy kiểm thử → ghép → đăng).
- [x] Đưa code ra gốc repo (trước nằm trong `tu-vi-ong-khuong/`), thêm `.gitattributes` (xuống dòng LF), `.gitignore`.

- [x] Lịch âm Việt Nam UTC+7, khớp lịch Hồ Ngọc Đức 1900–2199.
- [x] Engine an sao phái Việt, khớp lá số mẫu 12/12 cung và tracuutuvi 96/97 sao.
- [x] Trang chủ lập lá số, nút quay lại, link riêng cho từng lá số.
- [x] Nền sáng/tối, logo bát quái, dấu âm dương, cân lượng, lai nhân, ĐV./LN.
- [x] Nút (i) giải thích; sửa chữ đè; kiểm tra giao diện tự động 40 tổ hợp màn hình.
