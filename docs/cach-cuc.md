# Nhận diện cách cục

Cập nhật 30/10/2026. Đã duyệt và làm xong: code ở `src/cachcuc.js`, hiện trong tab Tổng quan, kiểm thử ở `tests/core.test.mjs`.
Muốn sửa điều kiện / lời giải nghĩa: sửa luật trong `src/cachcuc.js` rồi chạy `npm test` (bài thử báo nếu một cách không còn gặp hoặc gặp quá nhiều).
Các điểm ❓ đang làm theo cách ghi trong bảng và hiện dấu "?" trên web kèm dòng "Còn tranh cãi".

Cách đọc bảng:
- **Mệnh** = cung Mệnh. **TP** = tam phương tứ chính (Mệnh + Tài Bạch + Quan Lộc + Thiên Di). **Xung** = Thiên Di.
  **Giáp** = hai cung kề hai bên Mệnh. **Nhị hợp** = cung lục hợp với Mệnh (Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi).
- **Tứ sát** = Kình Dương, Đà La, Hỏa Tinh, Linh Tinh. **Không Kiếp** = Địa Không, Địa Kiếp.
- **Tỉ lệ** = số lá số có cách này trên 6.000 lá số ngẫu nhiên (1940–2019, đủ giờ, nam nữ) với bộ dò thử. Cách nào quá phổ biến (> 20 %) thì không còn ý nghĩa "cách".
- ❓ = các trang / sách nói khác nhau, cần người am hiểu xác nhận.

Tên và điều kiện tham khảo danh sách 51 cách của TuViMCP (Apache-2.0) và sách phái Việt; **lời giải nghĩa tự viết**, không chép sách.

## A. Bộ chính tinh (khung lá số) — mỗi lá số hiện 1 dòng, có khi 2

Xét chính tinh ở Mệnh (vô chính diệu thì mượn cung xung chiếu).

| Bộ | Điều kiện | Tỉ lệ |
| --- | --- | --- |
| Tử Phủ Vũ Tướng | Mệnh có Tử Vi / Thiên Phủ / Vũ Khúc / Thiên Tướng | 30 % |
| Sát Phá Liêm Tham | Mệnh có Thất Sát / Phá Quân / Liêm Trinh / Tham Lang | 33 % |
| Cơ Nguyệt Đồng Lương | Mệnh có Thiên Cơ / Thái Âm / Thiên Đồng / Thiên Lương | 38 % |
| Cự Nhật | Mệnh có Cự Môn / Thái Dương | 22 % |

Mệnh có sao thuộc hai bộ (ví dụ Tử Tham, Liêm Phủ, Cự Cơ) thì hiện cả hai bộ: 76 % lá số ra 1 bộ, 24 % ra 2 bộ.
Căn cứ ghi các sao của bộ có mặt trong TP.
(Bản đề xuất ban đầu đòi TP có ≥ 3 sao của bộ và ghi "khung pha" khi không đủ; khi thử thấy Mệnh mượn Đồng Lương mà bị xếp "khung pha" là vô lý, nên đổi sang xếp theo chính tinh của Mệnh và đưa Liêm Trinh vào bộ Sát Phá Liêm Tham.)

## B. Chính tinh đắc cách tại Mệnh (cát)

| Cách | Điều kiện | Tỉ lệ |
| --- | --- | --- |
| Tử Phủ đồng cung | Tử Vi + Thiên Phủ cùng ở Mệnh (Dần, Thân) | 1,5 % |
| Cực hướng Ly minh | Tử Vi ở Mệnh tại Ngọ, Mệnh không có tứ sát | 0,7 % |
| Quân thần khánh hội | Tử Vi ở Mệnh, TP có ≥ 3 trong Tả Phù, Hữu Bật, Khôi, Việt, Xương, Khúc | 3,1 % |
| Phủ Tướng triều viên | Mệnh không có Phủ, Tướng; Thiên Phủ và Thiên Tướng chiếu từ hai cung tam hợp | 7,6 % |
| Thất Sát triều đẩu | Thất Sát ở Mệnh tại Dần, Thân | 1,4 % |
| Thất Sát ngưỡng đẩu | Thất Sát ở Mệnh tại Tý, Ngọ ❓ (có sách gộp chung với triều đẩu) | 1,4 % |
| Anh tinh nhập miếu | Phá Quân ở Mệnh tại Tý, Ngọ | 1,6 % |
| Thạch trung ẩn ngọc | Cự Môn ở Mệnh tại Tý, Ngọ ❓ (có sách đòi thêm Hóa Lộc / Quyền / Khoa) | 1,5 % |
| Kim xán quang huy | Thái Dương ở Mệnh tại Ngọ | 0,5 % |
| Nhật chiếu lôi môn | Thái Dương ở Mệnh tại Mão | 0,8 % |
| Nguyệt lãng thiên môn | Thái Âm ở Mệnh tại Hợi | 0,9 % |
| Nhật Nguyệt tịnh minh | Mệnh ở Sửu, Thái Dương ở Tỵ, Thái Âm ở Dậu cùng chiếu ❓ (TuViMCP chỉ xét Nhật Tỵ Nguyệt Dậu, không xét Mệnh) | 0,8 % |
| Minh châu xuất hải | Mệnh vô chính diệu ở Mùi, Thái Dương ở Mão, Thái Âm ở Hợi | 1,0 % |
| Nhật Nguyệt đồng lâm | Thái Dương + Thái Âm cùng ở Mệnh (Sửu, Mùi) — tốt xấu lẫn lộn | 1,6 % |
| Nhật Nguyệt chiếu bích | Thái Dương + Thái Âm cùng ở cung Điền Trạch | 1,3 % |
| Cự Nhật đồng cung | Cự Môn + Thái Dương cùng ở Mệnh (Dần tốt hơn Thân) | 1,2 % |
| Cự Cơ đồng lâm | Cự Môn + Thiên Cơ cùng ở Mệnh (Mão tốt hơn Dậu) | 1,5 % |
| Cơ Lương Thìn Tuất | Thiên Cơ + Thiên Lương cùng ở Mệnh | 1,4 % |
| Thọ tinh nhập miếu | Thiên Lương ở Mệnh tại Ngọ | 0,9 % |
| Hùng tú triều viên | Liêm Trinh ở Mệnh tại Dần, Thân, Mệnh không có tứ sát ❓ (TuViMCP ghi Thân, Mùi; sách Trung Hoa ghi Dần, Thân) | 1,1 % |
| Tham Vũ đồng hành | Tham Lang + Vũ Khúc cùng ở Mệnh (Sửu, Mùi) | 1,4 % |
| Tham Hỏa / Tham Linh | Tham Lang ở Mệnh, Hỏa Tinh hoặc Linh Tinh ở Mệnh hoặc xung chiếu (bộc phát) | 2,1 % |

## C. Phụ tinh và Tứ hóa (cát)

| Cách | Điều kiện | Tỉ lệ |
| --- | --- | --- |
| Tam kỳ gia hội | Hóa Lộc, Hóa Quyền, Hóa Khoa đủ cả ba trong TP | 4,7 % |
| Quyền Lộc hội Mệnh | Hóa Lộc + Hóa Quyền trong TP (ẩn khi đã có Tam kỳ) | 13,7 % |
| Khoa Quyền Lộc giáp | Hai cung giáp Mệnh mang 2 trong 3 hóa Lộc / Quyền / Khoa | 4,0 % |
| Song Lộc giáp Mệnh | Lộc Tồn và Hóa Lộc ở hai cung giáp Mệnh | 1,4 % |
| Song Lộc đồng cung | Lộc Tồn + Hóa Lộc cùng ở Mệnh | 0,6 % |
| Song Lộc triều viên | Lộc Tồn và Hóa Lộc đều trong TP (không cùng ở Mệnh) | 10,2 % |
| Lộc Mã giao trì | Thiên Mã cùng cung với Lộc Tồn hoặc Hóa Lộc, ở Mệnh hoặc xung chiếu | 3,3 % |
| Minh Lộc ám Lộc | Mệnh có Hóa Lộc, cung nhị hợp có Lộc Tồn (hoặc ngược lại) | 1,4 % |
| Xương Khúc hội Mệnh | Văn Xương + Văn Khúc cùng ở Mệnh, hoặc Mệnh ở Sửu / Mùi được cả hai chiếu | 5,9 % |
| Tả Hữu đồng cung | Tả Phù + Hữu Bật cùng ở Mệnh | 1,4 % |
| Tọa quý hướng quý | Khôi ở Mệnh, Việt ở xung chiếu (hoặc ngược lại) | 5,0 % |
| Quý tinh giáp Mệnh | Hai cung giáp Mệnh là một cặp: Nhật–Nguyệt, Tả–Hữu, Khôi–Việt hoặc Xương–Khúc (ghi rõ cặp nào) | 10,7 % |
| Văn Lương chấn kỷ | Thiên Lương ở Mệnh, Văn Xương trong TP | 2,6 % |
| Dương Lương Xương Lộc | TP có Thái Dương, Thiên Lương, Văn Xương và Lộc (Tồn hoặc Hóa) | 4,8 % |

Bỏ khỏi danh sách: "Khôi Việt hội trong TP" (19,5 % — quá phổ biến), "Liêm Trinh văn vũ", "Hóa tinh phản quý" (ít dùng ở phái Việt).

## D. Hung cách / phá cách

| Cách | Điều kiện | Tỉ lệ |
| --- | --- | --- |
| Kình Đà giáp Mệnh | Kình Dương, Đà La ở hai cung giáp Mệnh (tức Lộc Tồn ở Mệnh) | 8,0 % |
| Không Kiếp giáp Mệnh | Địa Không, Địa Kiếp ở hai cung giáp Mệnh | 2,7 % |
| Hỏa Linh giáp Mệnh | Hỏa Tinh, Linh Tinh ở hai cung giáp Mệnh | 1,2 % |
| Mệnh vô chính diệu | Mệnh không có chính tinh (đã có ở Tổng quan — chỉ thêm nhãn) | 15,9 % |
| Vô chính diệu đắc tam không (cát) | Mệnh vô chính diệu, Mệnh + xung chiếu gặp ≥ 2 trong Tuần, Triệt, Địa Không, Thiên Không ❓ | 4,0 % |
| Không Kiếp thủ Mệnh | Địa Không hoặc Địa Kiếp ở Mệnh | 15,5 % |
| Mã đầu đới kiếm | Kình Dương ở Mệnh tại Ngọ — biến cách: gian nan rồi nổi | 1,6 % |
| Cự phùng tứ sát | Cự Môn ở Mệnh, cùng cung có một trong tứ sát | 2,7 % |
| Linh Xương Đà Vũ | TP có đủ Linh Tinh, Văn Xương, Đà La, Vũ Khúc | 2,3 % |
| Lộc phùng xung phá | Mệnh có Lộc Tồn / Hóa Lộc, Không Kiếp ở Mệnh hoặc xung chiếu | 4,7 % |
| Hình Tù giáp Ấn | Liêm Trinh + Thiên Tướng + Kình Dương cùng ở Mệnh | 0,3 % |
| Nhật Nguyệt phản bối | TP có Thái Dương hãm và Thái Âm hãm | 8,3 % |

Thống kê: mỗi lá số trung bình ra **2 cách** (ngoài bộ chính tinh), 90 % lá số ≤ 4 cách, ~17 % không có cách nào.

## Luật chung

1. **Phá cách**: cách cát mà Mệnh có tứ sát, Không Kiếp hoặc Hóa Kỵ cùng cung → vẫn hiện, ghi "bị phá bởi …" (không giấu đi).
   Riêng Cực hướng Ly minh, Hùng tú triều viên: điều kiện đã đòi không có tứ sát → gặp sát thì không thành cách.
2. **Cách lớn che cách nhỏ**: Tam kỳ gia hội che Quyền Lộc hội Mệnh; Song Lộc đồng cung che Song Lộc triều viên;
   Minh châu xuất hải che Mệnh vô chính diệu (ghi chung một dòng).
3. Mỗi cách có: tên · nhóm (Cát / Hung / Biến) · 1–2 câu nghĩa tự viết · **căn cứ** (sao nào ở cung nào) · ❓ nếu còn tranh cãi.

## Hiện ở đâu

- Tab **Tổng quan**: thêm mục "Cách cục" ngay sau "Cung Mệnh". Mỗi cách một dòng: nhãn màu Cát / Hung, tên in đậm, nghĩa, căn cứ in nhạt.
  Rê chuột / chạm vào một cách → sáng các cung liên quan trên lá số (dùng lại kiểu sáng của tam phương).
- Gửi kèm vào **Luận giải AI** (dòng "Cách cục: …") và tab **Dữ liệu JSON** (trường `cach_cuc`).
- Chỉ xét **lá số gốc** (Mệnh). Cách cục theo đại hạn / lưu niên để sau, đi cùng tính năng "Đổi năm xem".

## Code (sau khi duyệt)

- `src/cachcuc.js`: dữ liệu luật + bộ dò, thuần JS, chạy được trong Node như `engine.js`. Luật viết dạng hàm ngắn có tên điều kiện
  (`o(Mệnh, 'Tử Vi')`, `chieu(TP, …)`, `giap(…)`), mỗi luật tự trả về "căn cứ" để hiện.
- `tests/core.test.mjs`: lá số mẫu ra đúng các cách mong đợi; mỗi cách có ít nhất 1 lá số dựng sẵn làm ví dụ; tỉ lệ trên 2.000 lá số nằm trong khoảng hợp lý.
- `scripts/build.mjs` + `template.html`: thêm `/*CACHCUC*/`.
