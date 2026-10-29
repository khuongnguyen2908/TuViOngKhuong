# Tử Vi Ông Khương

Web lập lá số Tử Vi Đẩu Số theo phái Việt Nam. Người dùng nhập ngày giờ sinh, web an lá số 12 cung, hiển thị đại hạn, tiểu hạn, sao lưu niên và luận giải từng cung. Mọi phép tính chạy trên trình duyệt của người xem; không có máy chủ lưu dữ liệu.

- Âm lịch Việt Nam tính theo giờ Hà Nội (UTC+7), đúng cả những năm Tết lệch với lịch Trung Quốc (1985, 2007, 2030, 2053).
- Engine an sao phái Việt với 9 tùy chọn trường phái.
- Luận giải cơ bản ghép từ nghĩa sao và cung; luận giải AI theo chủ đề khi có cấu hình.
- Mỗi lá số có link riêng (`#la-so-...`), chỉ chứa ngày giờ và tùy chọn, không chứa họ tên.
- Lá số gần đây lưu trong trình duyệt của từng người, có nút xóa.
- Nền sáng hoặc tối, có nút bật tắt; lựa chọn được nhớ theo trình duyệt.
- Nút (i) giải thích cạnh các khái niệm khó; bấm vào sao trên lá số để xem nghĩa.
- Mỗi cung ghi tên cung theo đại vận (ĐV.) và lưu niên (LN.); đường tam hợp và xung chiếu có màu riêng.
- Thiên bàn có cân lượng (cân xương), lai nhân cung, nghĩa nạp âm; mỗi cung có dấu âm dương và màu theo ngũ hành của cung.

## Cấu trúc

```
index.html              Bản đã ghép sẵn, mở trực tiếp được
src/
  template.html         Khung trang
  styles.css            Giao diện
  config.js             Cấu hình (URL proxy AI)
  lunar.js              Âm lịch Việt Nam, can chi, tiết khí
  engine.js             An sao phái Việt
  content.js            Nghĩa cung, nghĩa sao (tự biên soạn)
  ai.js                 Gọi proxy AI khi chạy ngoài Claude
  app.js                Giao diện, điều hướng, xuất file
scripts/build.mjs       Ghép src/ thành một file HTML
tests/core.test.mjs     Kiểm thử âm lịch, lá số mẫu, proxy AI
worker/ai-proxy.js      Cloudflare Worker gọi Claude API
.github/workflows/      Kiểm thử và đưa lên GitHub Pages
```

Không có thư viện cần cài. Cần Node.js 20 trở lên để chạy kiểm thử và ghép trang.

```bash
npm test          # chạy kiểm thử
npm run build     # ghép src/ → index.html (tài liệu HTML đầy đủ)
node scripts/build.mjs ra.html --fragment   # bản để đăng làm artifact trong Claude
```

Muốn xem thử, mở `index.html` trong trình duyệt, hoặc chạy `npx serve .` rồi mở địa chỉ được in ra.

## Kiểm tra giao diện trên trình duyệt (tùy chọn)

`tests/browser/layout-qa.cjs` mở trang bằng Chromium ở nhiều cỡ màn hình, nền sáng và tối, rồi dò chữ đè nhau, chữ tràn khỏi ô cung, trang bị cuộn ngang và bấm thử mọi nút (i).

```bash
npm i -D playwright && npx playwright install chromium
node tests/browser/layout-qa.cjs 1440,1024,390 dark,light
```

## Đưa lên GitHub Pages

1. Đẩy repo lên GitHub, nhánh `main`.
2. Vào **Settings → Pages**, mục **Source** chọn **GitHub Actions**.
3. Mỗi lần đẩy lên `main`, workflow chạy kiểm thử rồi đăng trang tại `https://<tài-khoản>.github.io/<tên-repo>/`.

Khi chưa cấu hình AI, trang vẫn chạy đủ mọi tính năng trừ tab Luận giải AI (tab này tự ẩn).

## Bật Luận giải AI khi chạy trên GitHub Pages

Trình duyệt không được giữ API key, nên cần một proxy nhỏ. Repo có sẵn `worker/ai-proxy.js` cho Cloudflare Workers.

```bash
cd worker
cp wrangler.toml.example wrangler.toml      # sửa ALLOWED_ORIGINS thành domain GitHub Pages của bạn
npx wrangler secret put ANTHROPIC_API_KEY   # dán khóa Claude API
npx wrangler deploy                          # in ra URL dạng https://tuvi-ai-proxy.<ten>.workers.dev
```

Sau đó vào **Settings → Secrets and variables → Actions → Variables**, tạo biến `AI_ENDPOINT` với URL vừa nhận, rồi chạy lại workflow.

Lưu ý khi cho nhiều người dùng:

- Mọi lượt luận giải tính vào hóa đơn Claude API của chủ khóa. Nên bật giới hạn số lần gọi (phần `ratelimits` trong `wrangler.toml.example`) và đặt hạn mức chi tiêu trong Claude Console.
- `ALLOWED_ORIGINS` chặn trang khác gọi proxy của bạn từ trình duyệt, nhưng không chặn được người gọi thẳng bằng công cụ dòng lệnh. Giới hạn theo IP là lớp bảo vệ chính.
- Proxy chỉ chuyển tiếp nội dung lá số, không ghi log hay lưu lại.

## Chạy trong Claude và chạy trên GitHub Pages khác nhau thế nào

| Tính năng | Trong Claude (artifact) | Trên GitHub Pages |
| --- | --- | --- |
| Lập lá số, xem cung, đại hạn, tìm sao | Có | Có |
| Lá số gần đây | Có, theo từng trình duyệt | Có, theo từng trình duyệt |
| Link riêng cho từng lá số | Có trong trình duyệt; khi chia sẻ qua Claude tùy ứng dụng | Có, nút Chép link |
| Tải ảnh PNG, tải JSON | Có, qua hộp xác nhận của Claude | Có, tải thẳng |
| Luận giải AI | Có sẵn, mỗi người dùng lượt Claude của chính họ | Cần proxy và API key; chủ khóa trả phí |
| Ai mở được | Người được chia sẻ artifact | Bất kỳ ai có link |

## Tùy chọn trường phái

| Tùy chọn | Mặc định | Cách khác |
| --- | --- | --- |
| Mệnh chủ | Theo chi năm sinh | Theo chi cung Mệnh |
| Hỏa, Linh tuổi Tỵ Dậu Sửu | Hỏa khởi Mão, Linh khởi Tuất | Hỏa Tuất, Linh Mão |
| Khôi, Việt năm Canh | Sửu, Mùi | Ngọ, Dần |
| Tràng Sinh Thổ cục | Khởi ở Thân | Khởi ở Dần |
| Tứ hóa năm Canh | Nhật Vũ Âm Đồng | Nhật Vũ Đồng Âm |
| Hóa Khoa năm Nhâm | Thiên Phủ | Tả Phù |
| Thiên Giải | Từ Thân đếm thuận theo tháng | Đếm nhảy cung |
| Sinh tháng nhuận | An như tháng chính | Từ ngày 16 tính sang tháng sau |
| Giờ Tý muộn (23–24 giờ) | Tính sang ngày hôm sau | Giữ ngày hiện tại |

## Độ chính xác đã kiểm

- Lá số mẫu (nam, 29/08/1998 giờ Thân) khớp 12/12 cung với một lá số Việt in sẵn: sao, độ sáng chính tinh, đại hạn, tiểu hạn, Tràng Sinh, lưu nguyệt, Tuần, Triệt.
- Âm lịch khớp lịch Hồ Ngọc Đức từng ngày 1900–2199, trừ năm 1900 và hai ngày lỗi của bản Python của lịch đó.
- Khi phát triển, engine đã được đối chiếu với lasotuvi (2.999/3.000 lá số ngẫu nhiên khớp) và iztro (phần lõi chung khớp 1.942/1.942 lá số).

## Giấy phép

Mã của dự án chưa gắn giấy phép; hãy chọn một giấy phép trước khi công khai repo. Phần tham khảo từ bên thứ ba ghi trong [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Luận giải trên web mang tính tham khảo, không thay cho tư vấn chuyên môn.
