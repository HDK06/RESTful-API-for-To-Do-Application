# Ứng dụng Danh sách Công việc (Todo List)

Một ứng dụng quản lý danh sách công việc đơn giản sử dụng Node.js, Express, MongoDB và EJS cho người mới học lập trình web.

## Tính năng

- Tạo, đọc, cập nhật và xóa các mục công việc
- Cấu trúc công việc đơn giản với tiêu đề và trạng thái hoàn thành
- Giao diện người dùng đẹp, dễ sử dụng
- Đánh dấu công việc đã hoàn thành với gạch ngang
- Xử lý lỗi cơ bản
- Được thiết kế đơn giản cho người mới học Node.js

## Cấu trúc dự án

Dự án tuân theo kiến trúc MVC (Model-View-Controller) đơn giản:

```
todo-app/
├── public/            # Tệp tĩnh cho frontend
│   ├── style.css      # CSS
│   └── app.js         # JavaScript frontend
├── views/             # Template EJS
│   └── index.ejs      # Template chính
├── src/
│   ├── config/        # Cấu hình
│   ├── controllers/   # Xử lý logic
│   ├── middlewares/   # Middleware
│   ├── models/        # Mô hình dữ liệu
│   └── routes/        # Định nghĩa route
├── .env               # Biến môi trường
├── package.json       # Phụ thuộc và script
├── README.md          # Tài liệu dự án
└── server.js          # Điểm khởi đầu
```

## Yêu cầu

- Node.js
- MongoDB

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

- Xem danh sách tất cả công việc
- Thêm công việc mới
- Đánh dấu công việc là đã hoàn thành (với gạch ngang)
- Chỉnh sửa tiêu đề công việc
- Xóa một công việc cụ thể
- Xóa tất cả công việc

## API Endpoints

| Phương thức | Endpoint       | Mô tả                    |
| ----------- | -------------- | ------------------------ |
| GET         | /api/todos     | Lấy tất cả công việc     |
| GET         | /api/todos/:id | Lấy một công việc cụ thể |
| POST        | /api/todos     | Tạo công việc mới        |
| PUT         | /api/todos/:id | Cập nhật công việc       |
| DELETE      | /api/todos/:id | Xóa một công việc        |
| DELETE      | /api/todos     | Xóa tất cả công việc     |

## Ví dụ về Request và Response

### Tạo công việc mới

**Request:**

```http
POST /api/todos
Content-Type: application/json

{
  "title": "Hoàn thành dự án Node.js"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "60f7b0b3e8b9a8001c9f0b3a",
    "title": "Hoàn thành dự án Node.js",
    "completed": false,
    "createdAt": "2023-07-21T10:30:27.534Z"
  }
}
```

### Lấy tất cả công việc

**Request:**

```http
GET /api/todos
```

**Response:**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60f7b0b3e8b9a8001c9f0b3a",
      "title": "Hoàn thành dự án Node.js",
      "completed": false,
      "createdAt": "2023-07-21T10:30:27.534Z"
    }
  ]
}
```

## Những cải tiến cho người mới học

1. **Code đơn giản:** Mã nguồn được viết rõ ràng, dễ hiểu với các bình luận hướng dẫn
2. **Loại bỏ các thành phần phức tạp:** Không sử dụng validator.js phức tạp hoặc các schema phức tạp
3. **Kiểm tra dữ liệu đơn giản:** Xác thực dữ liệu được thực hiện trực tiếp trong controller
4. **Thông báo lỗi tiếng Việt:** Các thông báo lỗi được viết bằng tiếng Việt dễ hiểu
5. **Kiến trúc rõ ràng:** Tổ chức project rõ ràng để dễ dàng hiểu và mở rộng

## Dành cho người mới học

Đây là một dự án tốt để học về:

- Xây dựng REST API với Express
- Tương tác với MongoDB thông qua Mongoose
- Sử dụng EJS làm template engine
- Xử lý sự kiện phía client với JavaScript thuần
- Quản lý routes trong Express

## License

This project is licensed under the ISC License.
