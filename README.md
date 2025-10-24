# API CRUD User với Node.js + Express + MySQL

Dự án API CRUD cơ bản để quản lý users với Node.js, Express và MySQL.

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình Database
Tạo file `.env` trong thư mục gốc với nội dung:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name

# Server Configuration
PORT=3000
```

### 3. Chạy server
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📊 Cấu trúc Database

Đảm bảo bảng `users` có cấu trúc:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔗 API Endpoints

### Health Check
- **GET** `/` - Kiểm tra server hoạt động

### Users Management
- **GET** `/users` - Lấy tất cả users
- **GET** `/users/:id` - Lấy user theo ID
- **POST** `/users` - Tạo user mới
- **PUT** `/users/:id` - Cập nhật user
- **DELETE** `/users/:id` - Xóa user

## 📝 Cách sử dụng API

### 1. Xem tất cả users
```bash
curl http://localhost:3000/users
```

### 2. Xem user theo ID
```bash
curl http://localhost:3000/users/1
```

### 3. Tạo user mới
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Nguyễn Văn A", "email": "nguyenvana@example.com", "phone": "0123456789", "address": "Hà Nội"}'
```

**Hoặc dùng PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method POST -ContentType "application/json" -Body '{"name": "Nguyễn Văn A", "email": "nguyenvana@example.com", "phone": "0123456789", "address": "Hà Nội"}'
```

### 4. Cập nhật user
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Tên mới", "email": "emailmoi@example.com", "phone": "0987654321", "address": "TP.HCM"}'
```

**Hoặc dùng PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/users/1" -Method PUT -ContentType "application/json" -Body '{"name": "Tên mới", "email": "emailmoi@example.com", "phone": "0987654321", "address": "TP.HCM"}'
```

### 5. Xóa user
```bash
curl -X DELETE http://localhost:3000/users/1
```

**Hoặc dùng PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/users/1" -Method DELETE
```

## 🛠️ Cấu trúc Dự án

```
src/
├── config/
│   └── db.js          # Cấu hình database
├── controllers/
│   └── userController.js  # Logic xử lý API
├── models/
│   └── userModel.js   # Tương tác với database
├── routes/
│   └── userRoutes.js  # Định nghĩa routes
├── app.js            # Cấu hình Express app
└── index.js          # Entry point
```

## 📋 Response Format

### Thành công
```json
{
  "id": 1,
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0123456789",
  "address": "Hà Nội",
  "created_at": "2025-10-24T10:18:35.000Z",
  "updated_at": "2025-10-24T10:18:35.000Z"
}
```

### Lỗi
```json
{
  "error": "User not found"
}
```

## 🔧 Scripts

- `npm start` - Chạy server production
- `npm run dev` - Chạy server development với nodemon
- `npm run lint` - Kiểm tra code style
- `npm run format` - Format code

## 📦 Dependencies

- **express** - Web framework
- **mysql2** - MySQL driver
- **dotenv** - Environment variables

## 🐛 Troubleshooting

### Lỗi Database Connection
- Kiểm tra thông tin trong file `.env`
- Đảm bảo MySQL server đang chạy
- Kiểm tra username/password database

### Lỗi "Cannot GET /users"
- Đảm bảo server đang chạy trên port 3000
- Kiểm tra endpoint URL có đúng không

### Lỗi Email Duplicate
- Email phải unique, không được trùng lặp
- Kiểm tra email đã tồn tại chưa trước khi tạo mới
