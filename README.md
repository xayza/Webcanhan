# Do — Portfolio web

Web portfolio 1 trang, lấy cảm hứng cấu trúc từ duycuf.vn
(hero + 5 mục hành trình đánh số 01–05 + việc đã làm + liên hệ),
nhưng nội dung viết lại hoàn toàn theo công việc của Do.
Không framework, không cần build.

## Chạy local

Mở file `index.html` bằng trình duyệt là chạy.
Hoặc chạy server tĩnh:

```bash
cd do-portfolio-web
python3 -m http.server 8000
# mở http://localhost:8000
```

## Sếp cần sửa những gì trước khi đăng

1. **Tên / câu định vị** ở đầu `index.html` (thẻ `<h1>` trong `.hero`).
2. **Link liên hệ** ở cuối `index.html` — hiện đang để `#`, thay bằng
   link Facebook / YouTube / TikTok / email thật.
3. **Mô tả từng mục** trong `#works` nếu muốn thêm link bài/video thật.

## Đưa lên mạng (miễn phí, nhanh nhất)

- **GitHub Pages:** tạo repo mới trên GitHub, push 3 file
  `index.html`, `styles.css`, `script.js` lên nhánh `main`,
  vào Settings → Pages → chọn nhánh `main`, là có link.
- **Vercel / Netlify:** kéo-thả cả thư mục này lên là chạy,
  không cần cấu hình gì thêm.

## Cấu trúc

```
index.html   — toàn bộ nội dung, sửa chữ ở đây
styles.css   — màu, chữ, bố cục, responsive
script.js    — chỉ ghi năm hiện tại ở footer
```
