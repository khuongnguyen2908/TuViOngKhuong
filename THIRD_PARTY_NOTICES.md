# Ghi nhận mã nguồn và tài nguyên bên thứ ba

## lasotuvi (MIT)

Bảng độ sáng (miếu, vượng, đắc, bình, hãm), ngũ hành của sao và nhiều quy tắc an sao trong `src/engine.js` được tham khảo và chuyển sang JavaScript từ dự án [lasotuvi](https://github.com/doanguyen/lasotuvi). Dự án này đã sửa một số chỗ khác với lasotuvi (Khôi/Việt năm Mậu, thứ tự Thai/Dưỡng, Phá Toái, cách tra Mệnh chủ/Thân chủ).

```
MIT License

Copyright (c) 2016 doanguyen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## TuViMCP (Apache-2.0)

Tên và điều kiện nhận diện một số cách cục trong `src/cachcuc.js` tham khảo danh sách cách cục của [TuViMCP](https://github.com/nmhaaa3218/TuViMCP) (© 2026 nmhaaa3218, Apache License 2.0). Không chép mã hay lời bình; điều kiện được viết lại và sửa theo phái Việt (xem `docs/cach-cuc.md`), lời giải nghĩa tự biên soạn.

## html-to-image (MIT)

Tải từ CDN jsDelivr (`html-to-image@1.11.11`) để xuất ảnh PNG. Mã không nằm trong repo này. Xem https://github.com/bubkoo/html-to-image

## Phông chữ (SIL Open Font License 1.1)

Be Vietnam Pro và Cormorant Garamond, tải từ Google Fonts.

## Thuật toán thiên văn

Công thức tính sóc và kinh độ Mặt Trời theo sách *Astronomical Algorithms* (Jean Meeus, 1998). Mã trong `src/lunar.js` được viết mới, không sao chép mã âm lịch của Hồ Ngọc Đức.

## Công thức thiên văn cho Bản đồ sao (src/bandosao.js)

Không chép mã nguồn; công thức được viết lại từ các tài liệu công khai:

- Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998): Mặt Trăng (chương 47), nút thật, giờ sao, Điểm Mọc, Thiên Đỉnh.
- Paul Schlyter, *How to compute planetary positions* (stjarnhimlen.se): phần tử quỹ đạo và nhiễu Mộc – Thổ – Thiên Vương.
- E. M. Standish (JPL), *Keplerian Elements for Approximate Positions of the Major Planets*: phần tử quỹ đạo Diêm Vương.
