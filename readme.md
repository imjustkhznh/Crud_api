# 🚀 CRUD API - User Management

API RESTful để quản lý users sử dụng Node.js, Express và PostgreSQL.

## ✨ Tính năng

- ✅ **Create** - Tạo user mới
- ✅ **Read** - Lấy danh sách users hoặc chi tiết 1 user
- ✅ **Update** - Cập nhật thông tin user
- ✅ **Delete** - Xóa user
- ✅ Error handling với validation
- ✅ ESLint + Prettier để maintain code quality

## 🛠️ Tech Stack

- **Node.js** v22+ - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart server

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/imjustkhznh/Crud_api.git
cd Crud_api
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Setup PostgreSQL Database

Tạo database và table trong pgAdmin4 hoặc psql:

```sql
-- Tạo database
CREATE DATABASE api_crud_db;

-- Kết nối vào database
\c api_crud_db

-- Tạo table users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Config Environment Variables

Tạo file `.env` trong thư mục gốc:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=api_crud_db
DB_PORT=5432
PORT=3000
```

⚠️ **Lưu ý:** Thay `your_password_here` bằng password PostgreSQL của bạn

### 5. Chạy server

**Development mode (auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Create User (Tạo user mới)

```http
POST /users
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "a@example.com"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "created_at": "2025-10-24T10:30:00.000Z"
}
```

### 2. Get All Users (Lấy danh sách users)

```http
GET /users
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Nguyen Van A",
    "email": "a@example.com",
    "created_at": "2025-10-24T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Tran Thi B",
    "email": "b@example.com",
    "created_at": "2025-10-24T11:00:00.000Z"
  }
]
```

### 3. Get User By ID (Lấy 1 user)

```http
GET /users/:id
```

**Example:**
```http
GET /users/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "created_at": "2025-10-24T10:30:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "message": "User not found"
}
```

### 4. Update User (Cập nhật user)

```http
PUT /users/:id
Content-Type: application/json

{
  "name": "Nguyen Van A Updated",
  "email": "a.updated@example.com"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Nguyen Van A Updated",
  "email": "a.updated@example.com",
  "created_at": "2025-10-24T10:30:00.000Z"
}
```

### 5. Delete User (Xóa user)

```http
DELETE /users/:id
```

**Example:**
```http
DELETE /users/1
```

**Response (200 OK):**
```json
{
  "message": "User deleted",
  "user": {
    "id": 1,
    "name": "Nguyen Van A",
    "email": "a@example.com"
  }
}
```

## 🧪 Test API

### Sử dụng Thunder Client (VS Code Extension)

1. Cài extension **Thunder Client** trong VS Code
2. Click icon ⚡ ở sidebar
3. Tạo New Request và test các endpoints

### Sử dụng Postman

1. Tải [Postman](https://www.postman.com/downloads/)
2. Import collection hoặc tạo request thủ công
3. Test các endpoints theo tài liệu trên

### Sử dụng curl

```bash
# Create user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Get all users
curl http://localhost:3000/users

# Get user by ID
curl http://localhost:3000/users/1

# Update user
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","email":"updated@example.com"}'

# Delete user
curl -X DELETE http://localhost:3000/users/1
```

## 📁 Cấu trúc Project

```
Crud_api/
├── src/
│   ├── controllers/
│   │   └── userController.js    # Logic xử lý CRUD
│   ├── models/
│   │   └── userModel.js         # Query database
│   ├── routes/
│   │   └── userRoutes.js        # Định nghĩa routes
│   ├── db.js                    # Kết nối PostgreSQL
│   └── index.js                 # Entry point
├── .env                         # Environment variables (không push lên Git)
├── .env.example                 # Template cho .env
├── .eslintrc.js                 # ESLint config
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Prettier config
├── package.json                 # Dependencies & scripts
└── README.md                    # Documentation
```

## 🔧 Scripts

```bash
npm start          # Chạy server (production)
npm run dev        # Chạy server với nodemon (development)
npm run lint       # Kiểm tra code với ESLint
npm run format     # Format code với Prettier
```

## ⚠️ Error Handling

API trả về các error codes phổ biến:

| Status Code | Mô tả |
|-------------|-------|
| 200 | OK - Request thành công |
| 201 | Created - Tạo resource thành công |
| 400 | Bad Request - Dữ liệu không hợp lệ (email trùng) |
| 404 | Not Found - User không tồn tại |
| 500 | Internal Server Error - Lỗi server |

**Ví dụ error response:**
```json
{
  "error": "Email already exists"
}
```

## 🔐 Security Notes

- ⚠️ File `.env` chứa thông tin nhạy cảm, **KHÔNG push lên GitHub**
- ✅ Đã config `.gitignore` để ignore `.env`
- ✅ Sử dụng `.env.example` để hướng dẫn config

## 🚀 Deployment

### Deploy lên Railway/Render/Heroku

1. Tạo PostgreSQL database trên platform
2. Set environment variables trên platform
3. Deploy code

### Environment Variables cần set:

```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432
PORT=3000
```

## 🤝 Contributing

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Mở Pull Request

## 📝 License

MIT License - feel free to use this project!

## 👤 Author

**imjustkhznh**

- GitHub: [@imjustkhznh](https://github.com/imjustkhznh)
- Repository: [Crud_api](https://github.com/imjustkhznh/Crud_api)

## 📮 Contact

Có thắc mắc? Tạo [Issue](https://github.com/imjustkhznh/Crud_api/issues) hoặc liên hệ qua GitHub!

---

⭐ **Star repo này nếu thấy hữu ích!** ⭐