# Ứng dụng Danh sách Công việc (Todo List)

Ứng dụng quản lý danh sách công việc sử dụng Node.js, Express, MongoDB và EJS.

## Tính năng

- Tạo, đọc, cập nhật và xóa các mục công việc
- Đánh dấu công việc đã hoàn thành với gạch ngang
- Sắp xếp công việc theo thời gian cập nhật

## Cấu trúc dự án

Dự án tuân theo kiến trúc MVC (Model-View-Controller):

```
todo-app/
├── public/            # Tệp tĩnh cho frontend
│   ├── style.css      # CSS
│   └── app.js         # JavaScript frontend
├── views/             # Template EJS
│   └── index.ejs
├── src/
│   ├── config/        # Cấu hình
│   ├── controllers/   # Xử lý logic
│   ├── middlewares/   # Middleware
│   ├── models/        # Mô hình dữ liệu
│   └── routes/        # Định nghĩa route
├── .env               # Biến môi trường
├── package.json
├── README.md          # Tài liệu
└── server.js          # Điểm khởi đầu
```

## Công nghệ

- Node.js
- Express.js
- MongoDB
- EJS

## Cài đặt

1. Clone repository:

   ```
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. Cài đặt dependencies:

   ```
   npm install
   ```

3. Tạo tệp `.env` trong thư mục gốc:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/todo-app
   NODE_ENV=development
   ```

## Chạy ứng dụng

- Chế độ phát triển (với nodemon):

  ```
  npm run dev
  ```

- Chế độ thường:
  ```
  npm start
  ```

Sau khi khởi động, truy cập ứng dụng tại: http://localhost:3001

## Giao diện người dùng

Ứng dụng có giao diện người dùng trực quan cho phép:

- Xem danh sách tất cả công việc (sắp xếp theo thời gian cập nhật mới nhất)
- Thêm công việc mới
- Đánh dấu công việc là đã hoàn thành
- Chỉnh sửa tiêu đề công việc
- Xóa một công việc cụ thể
- Xóa tất cả công việc

## API Endpoints

| Phương thức | Endpoint       | Mô tả                |
| ----------- | -------------- | -------------------- |
| GET         | /api/todos     | Lấy tất cả công việc |
| POST        | /api/todos     | Tạo công việc mới    |
| PUT         | /api/todos/:id | Cập nhật công việc   |
| DELETE      | /api/todos/:id | Xóa một công việc    |
| DELETE      | /api/todos     | Xóa tất cả công việc |

## Mô hình dữ liệu

Schema của công việc bao gồm:

- `title`: Tiêu đề công việc (String, bắt buộc)
- `completed`: Trạng thái hoàn thành (Boolean, mặc định: false)
- `updatedAt`: Thời gian cập nhật gần nhất (tự động tạo)
- `createdAt`: Thời gian tạo (tự động tạo)
