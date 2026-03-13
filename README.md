# Cổng Thông Tin Tuyển Dụng - Thịnh Thế Vinh Hoa (TTVH)

Đây là hệ thống Website Tuyển Dụng chuyên dụng cho **Thịnh Thế Vinh Hoa**, được thiết kế với phong cách hiện đại, tối ưu trải nghiệm người dùng (UX) và khả năng chuyển đổi ứng tuyển cực cao theo tiêu chuẩn Hadasa/1Office.

## 🚀 Công Nghệ Sử Dụng

Dự án được xây dựng dựa trên các công nghệ hiện đại hàng đầu:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/) / [Tabler Icons](https://tabler.io/icons)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Animation:** Tailwind Animate & CSS Transitions
- **Excel Processing:** [XLSX](https://www.npmjs.com/package/xlsx) (cho tính năng Import/Export mẫu tuyển dụng)

## ✨ Tính Năng Nổi Bật

### 🌐 Đối với Ứng viên (Landing Page)
- **Giao diện Responsive:** Hiển thị hoàn hảo trên mọi thiết bị (Mobile, Tablet, Desktop).
- **Bộ lọc thông minh:** Tìm kiếm việc làm theo thương hiệu (MayCha, Tam Hảo, Trà Hú...), vị trí và địa điểm.
- **Trải nghiệm mượt mà:** Hiệu ứng hover, micro-animations giúp tăng sự tương tác và chuyên nghiệp.
- **Tích hợp 1Office:** Nút ứng tuyển kết nối trực tiếp đến hệ thống quản trị nhân sự 1Office.
- **Section Testimonials:** Chia sẻ từ các quản lý cửa hàng, tăng độ tin cậy cho thương hiệu tuyển dụng.

### 🔐 Đối với Nhà tuyển dụng (Admin Panel)
- **Dashboard Quản trị:** Quản lý danh sách tin tuyển dụng tập trung.
- **Trình soạn thảo Rich Text:** Soạn thảo mô tả công việc (JD) và yêu cầu ứng viên dễ dàng với React Quill.
- **Import/Export Excel:** Tiết kiệm thời gian bằng cách đăng tin hàng loạt qua file mẫu Excel.
- **Quản lý trạng thái:** Dễ dàng bật/tắt hoặc cập nhật thông tin tin tuyển dụng.

## 📁 Cấu Trúc Thư Mục

```text
/
├── app/               # Next.js App Router (Layouts & Pages)
│   ├── admin/         # Trang quản trị viên (Job Management)
│   ├── api/           # Các API Routes xử lý dữ liệu (CRUD Jobs)
│   ├── login/         # Trang đăng nhập quản trị
│   └── globals.css    # Style hệ thống và biến màu chủ đạo
├── components/        # Các UI Components tái sử dụng
│   ├── ui/            # Các nguyên tử UI gốc (Button, Input, Dialog...)
│   └── (Sections)/    # Các phần chính của Landing Page (Hero, JobBoard...)
├── lib/               # Cấu hình Database, Utilities (Prisma client, db helper)
├── prisma/            # Cấu hình database schema (nếu có dùng Prisma)
├── public/            # Hình ảnh, Assets tĩnh (Logos...)
└── scripts/           # Các script hỗ trợ (Seed data, Create table...)
```

## 🛠️ Hướng Dẫn Cài Đặt và Phát Triển

### 1. Cài đặt môi trường
Đảm bảo bạn đã cài đặt Node.js (phiên bản 18 trở lên).

```bash
# Cài đặt các thư viện phụ thuộc
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc và cấu hình các thông số:
- `DIRECT_URL`: Đường dẫn kết nối đến PostgreSQL.
- Các cấu hình khác nếu cần.

### 3. Khởi chạy dự án

```bash
# Chạy môi trường phát triển (Local)
npm run dev
```

Truy cập trang web tại: `http://localhost:3000`

### 4. Xây dựng bản chính thức (Production)

```bash
npm run build
npm start
```

## 📝 Ghi chú quan trọng
- Hệ thống sử dụng font **Montserrat** làm chủ đạo để tạo cảm giác trẻ trung, hiện đại.
- Màu sắc chủ đạo (Primary) được định nghĩa trong `app/globals.css` để dễ dàng đồng nhất profile branding.

---
© 2026 Thịnh Thế Vinh Hoa. All rights reserved.
