# Tử Vi Ông Khương

Web lập lá số Tử Vi Đẩu Số theo phái Việt Nam. Người dùng nhập ngày giờ sinh, web an lá số 12 cung, hiển thị đại hạn, tiểu hạn, sao lưu niên và luận giải từng cung. Mọi phép tính chạy trên trình duyệt của người xem; không có máy chủ lưu dữ liệu.

- Âm lịch Việt Nam tính theo giờ Hà Nội (UTC+7), đúng cả những năm Tết lệch với lịch Trung Quốc (1985, 2007, 2030, 2053).
- Engine an sao phái Việt với 9 tùy chọn trường phái.
- Luận giải cơ bản ghép từ nghĩa sao và cung (kho nghĩa tự biên soạn: 14 chính tinh × 12 cung, 26 phụ tinh chủ chốt × 4 nhóm cung, 57 phụ tinh khác; đọc duyệt ở `docs/nghia-sao.md`); luận giải AI theo chủ đề khi có cấu hình.
- Nhận diện cách cục của cung Mệnh (bộ chính tinh, cát cách, hung cách, phá cách); bấm vào một cách để tô các cung liên quan.
- Lời khuyên cho từng điểm xấu: hung cách, phá cách, chính tinh hãm, sát tinh và hung tinh (khi bấm vào sao), sát tinh ở Mệnh và tiểu hạn.
- Bát Tự (Tứ Trụ): chọn ngay ở trang chủ. Trụ năm đổi ở Lập Xuân, trụ tháng theo 12 tiết (tính thời điểm giao tiết đến phút); tàng can, thập thần, Trường Sinh, nạp âm, Thai nguyên, Mệnh cung, thần sát chính, ngũ hành và ước lượng nhật chủ mạnh yếu, đại vận, lưu niên; không rõ giờ thì lập ba trụ. Đối chiếu khớp với bazi.vn ở 3 lá số mẫu. Có hồ sơ tính cách 10 nhật chủ, biểu đồ ngũ giác ngũ hành, biểu tượng con giáp (emoji, Mão là mèo) và chữ Hán ngũ hành, nút (i) và bấm vào thập thần / thần sát để xem nghĩa.
- Không rõ giờ sinh: xem nhanh cung Mệnh, Thân, Cục của cả 12 giờ (lọc theo buổi), bấm để mở lá số từng giờ.
- So sánh hai lá số (vợ chồng, đối tác, bạn bè): ngũ hành bản mệnh, thiên can, địa chi, cung Mệnh, tuổi rơi vào cung, cung liên quan; mỗi điểm kỵ có lời khuyên; chép được để hỏi AI khác.
- Đổi năm xem ngay trên lá số (nút ‹ ›, nút Năm nay, dải 10 năm của từng đại hạn); có sao lưu niên (L.) và sao lưu đại hạn (ĐV.), bật tắt riêng.
- Mỗi lá số có link riêng (`#la-so-...`), chỉ chứa ngày giờ, năm xem và tùy chọn, không chứa họ tên.
- Lá số gần đây lưu trong trình duyệt của từng người, có nút xóa.
- Nền sáng hoặc tối, có nút bật tắt; lựa chọn được nhớ theo trình duyệt.
- Nút (i) giải thích cạnh các khái niệm khó; bấm vào sao trên lá số để xem nghĩa.
- Mỗi cung ghi tên cung theo đại vận (ĐV.) và lưu niên (LN.); đường tam hợp và xung chiếu có màu riêng.
- Thiên bàn có cân lượng (cân xương), lai nhân cung, nghĩa nạp âm; mỗi cung có dấu âm dương và màu theo ngũ hành của cung.

## Cấu trúc

```
index.html              Bản đã ghép sẵn, mở trực tiếp được
TODO.md                 Việc còn nợ và cần làm
src/
  template.html         Khung trang
  styles.css            Giao diện
  config.js             Cấu hình (URL proxy AI)
  lunar.js              Âm lịch Việt Nam, can chi, tiết khí
  engine.js             An sao phái Việt
  content.js            Nghĩa cung, nghĩa sao chung (tự biên soạn)
  nghiasao.js           Nghĩa sao theo cung / nhóm cung (tự biên soạn; trang đọc duyệt: docs/nghia-sao.md)
  cachcuc.js            Nhận diện cách cục (luật + nghĩa tự biên soạn; danh sách ở docs/cach-cuc.md)
  loikhuyen.js          Lời khuyên cho điểm xấu (tự biên soạn)
  sosanh.js             So sánh hai lá số (xem tuổi)
  battu.js              Bát Tự: tứ trụ theo tiết khí, thập thần, đại vận (lời giải nghĩa tự biên soạn)
  ai.js                 Gọi proxy AI khi chạy ngoài Claude
  app.js                Giao diện, điều hướng, xuất file
scripts/build.mjs       Ghép src/ thành một file HTML
scripts/nghia-sao-doc.mjs  Tạo docs/nghia-sao.md (npm run build tự chạy)
tests/core.test.mjs     Kiểm thử âm lịch, lá số mẫu, cách cục, lời khuyên, so sánh, proxy AI
worker/ai-proxy.js      Cloudflare Worker gọi Claude API
worker/gop-y.mjs        Cloudflare Worker lưu góp ý (D1, bảng ở gop-y.sql)
scripts/dev-server.mjs  Server chạy thử (npm run dev), góp ý lưu SQLite ở .local/
scripts/cat-icon.py     Cắt tờ icon trong design/ thành ảnh con giáp, thiên can (assets/)
assets/                 Mã QR, ảnh 12 con giáp và 10 thiên can
design/                 Ảnh gốc (không đưa lên trang)
.github/workflows/      Kiểm thử và đưa lên GitHub Pages (pages.yml)
```

Không có thư viện cần cài. Cần Node.js 22.13 trở lên để chạy kiểm thử và ghép trang.

```bash
npm test          # chạy kiểm thử
npm run build     # ghép src/ → index.html (tài liệu HTML đầy đủ)
node scripts/build.mjs ra.html --fragment   # bản để đăng làm artifact trong Claude
```

Muốn xem thử, chạy `npm run dev` rồi mở http://localhost:8080. Lệnh này ghép trang rồi chạy server thử có sẵn nút Góp ý (lưu trong `.local/gop-y.db`, cần Node 22.5 trở lên vì dùng `node:sqlite`). Mở thẳng `index.html` cũng được nhưng không có Góp ý.

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

## Bật Góp ý (tên, số sao, nội dung) khi chạy trên GitHub Pages

Trang tĩnh không tự lưu được bình luận của mọi người, nên cần một Worker nhỏ có cơ sở dữ liệu D1 (Cloudflare, gói miễn phí đủ dùng). Code ở `worker/gop-y.mjs`.

```bash
cd worker
cp gop-y.wrangler.toml.example gop-y.wrangler.toml   # sửa ALLOWED_ORIGINS thành domain GitHub Pages
npx wrangler d1 create tuvi-gop-y                   # dán database_id in ra vào gop-y.wrangler.toml
npx wrangler d1 execute tuvi-gop-y --remote --file=gop-y.sql -c gop-y.wrangler.toml
npx wrangler secret put SALT -c gop-y.wrangler.toml  # gõ một chuỗi bí mật bất kỳ
npx wrangler deploy -c gop-y.wrangler.toml           # in ra URL dạng https://tuvi-gop-y.<ten>.workers.dev
```

Sau đó vào **Settings → Secrets and variables → Actions → Variables**, tạo biến `FEEDBACK_ENDPOINT` với URL vừa nhận, rồi chạy lại workflow. Nút Góp ý chỉ hiện khi đã có biến này.

Quản lý góp ý (ẩn bình luận xấu, duyệt khi bật `DUYET_TRUOC = "1"`):

```bash
npx wrangler d1 execute tuvi-gop-y --remote -c gop-y.wrangler.toml --command "SELECT id, ten, sao, noi_dung FROM gop_y ORDER BY id DESC LIMIT 20"
npx wrangler d1 execute tuvi-gop-y --remote -c gop-y.wrangler.toml --command "UPDATE gop_y SET hien = 0 WHERE id = 12"   # ẩn
npx wrangler d1 execute tuvi-gop-y --remote -c gop-y.wrangler.toml --command "UPDATE gop_y SET hien = 1 WHERE hien = 0"  # duyệt hết
```

Worker không lưu IP gốc; IP được băm kèm `SALT` chỉ để chặn gửi dồn (3 lần trong 10 phút). Có ô bẫy chống bot, giới hạn độ dài, chặn bài nhiều link.

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
