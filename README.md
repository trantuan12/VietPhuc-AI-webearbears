# Việt Phục Remix – Gen Z Fashion Studio | AI Cultural Stylist

> **Nền tảng sáng tạo thời trang cổ phục Việt Nam ứng dụng Trí tuệ Nhân tạo thế hệ mới (Google Gemini API).**
> Cầu nối hài hòa giữa giá trị di sản văn hóa truyền thống và phong cách đương đại phóng khoáng của thế hệ trẻ Gen Z.

---

## 🌟 Tính Năng Nổi Bật

1. **2.5D Interactive Anime Fashion Avatar**:
   - Nhân vật thời trang chuyển đổi mượt mà giữa **Nữ** & **Nam**.
   - Hỗ trợ 3 góc nhìn linh hoạt: **Chính diện (Trước)**, **Nghiêng 3/4**, và **Sau lưng**.
   - Thư viện trang phục cổ truyền: **Áo Nhật Bình Cung Đình (Nhà Nguyễn)**, **Áo Ngũ Thân Tay Chẽn**, **Áo Dài Cổ Truyền**, **Áo Tứ Thân Kinh Bắc**.
   - Hệ thống Callout thông minh chỉ dẫn chi tiết: *Cổ áo ngũ sắc, Tay thụng/chẽn, Họa tiết thêu hoàng triều, Thân tà lụa*.

2. **AI Cultural Stylist (Remix Engine)**:
   - Phối đồ thông minh bằng ngôn ngữ tự nhiên tiếng Việt hoặc từ khóa phong cách.
   - 3 tầng phối đồ (Remix Tiers): **Cổ Điển (Classic)**, **Giao Thoa (Fusion)**, **Gen Z (Phá cách)**.
   - Tự động gợi ý phụ kiện đương đại (sneaker, boot combat, kính râm, túi canvas tote, quạt lụa, khăn đóng...).
   - Đổi màu sắc thời trang theo thời gian thực (Áo, Cổ áo, Quần lụa, Yếm đào, Bao thắt lưng).

3. **Cơ chế Tự động Đổi Model (Auto-Failover Gemini Pool)**:
   - Tích hợp toàn bộ pool 9 model trong gói Free API của Google:
     - `gemini-3.5-flash-lite` (500 RPD / 15 RPM)
     - `gemini-3.1-flash-lite` (500 RPD / 15 RPM)
     - `gemini-flash-lite-latest` (< 0.9s latency)
     - `gemini-3.5-flash`, `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-3-flash-preview`
   - Tự động chuyển đổi model ngay lập tức khi gặp lỗi `429` (Quota / Rate Limit), `503` (High Demand / Overloaded), hoặc `Timeout`.
   - Cơ chế Cooldown 60s thông minh cho model chạm hạn ngạch để đảm bảo trải nghiệm liên tục không gián đoạn.

4. **Thẩm Định Di Sản (Culture Guard Engine)**:
   - Đánh giá điểm chuẩn mực văn hóa (Cultural Heritage Score) trên thang điểm 100.
   - Phát hiện xung đột di sản theo bối cảnh sự kiện (*Lễ tốt nghiệp, Dạo phố nghệ thuật, Nghi lễ thờ tự*).
   - Tính năng **Sửa Lỗi Di Sản (AI Repair)**: Tự động đề xuất vật phẩm thay thế chuẩn mực.

5. **Công Cụ Chuyên Nghiệp**:
   - **Di Sản X-Ray**: Soi chiếu cấu trúc lớp áo bên trong và hoa văn lịch sử.
   - **So Sánh A/B**: Đối chiếu trực quan bản phối gốc và bản remix mới.
   - **Xuất Lookbook**: Tạo thẻ phong cách thời trang nghệ thuật sẵn sàng chia sẻ mạng xã hội.
   - **Thư Viện Cổ Phục**: Cung cấp kiến thức lịch sử, tư liệu khảo cứu đã được xác thực provenance.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion (Framer Motion).
- **Backend / API**: Node.js, Express, TSX, Vite.
- **AI Core**: `@google/genai` (Google Gen AI SDK v2), Structured Outputs JSON Schema.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Run Locally)

### 1. Yêu cầu hệ thống
- **Node.js** (Phiên bản 18+ hoặc 20+)
- Trình quản lý gói **npm**

### 2. Cài đặt các thư viện
```bash
npm install
```

### 3. Cấu hình Khóa API Gemini
Tạo file `.env` (hoặc sao chép từ `.env.example`):
```bash
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```

### 4. Khởi chạy ứng dụng
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

---

## ☁️ Triển Khai Lên Google AI Studio (Deploy on Google AI Studio)

1. Tải về mã nguồn dự án (hoặc đóng gói thư mục thành file `.zip`, **không bao gồm thư mục `node_modules` và `dist`**).
2. Truy cập [Google AI Studio](https://aistudio.google.com).
3. Tạo hoặc Import Applet mới bằng cách upload file `.zip`.
4. Cấu hình biến môi trường `GEMINI_API_KEY` trong mục **Secrets** của AI Studio.
5. AI Studio sẽ tự động cài đặt dependencies và khởi chạy ứng dụng!

---

## 📄 Bản Quyền & Giấy Phép
Dự án được phát triển cho cuộc thi **AI Arena**, tôn vinh di sản Cổ Phục Việt Nam trong kỷ nguyên trí tuệ nhân tạo.
