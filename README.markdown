# 🚀 CRUD API - User Management

RESTful API quản lý users với Node.js, Express và PostgreSQL.

## ✨ Tính năng
- CRUD: Tạo, đọc, cập nhật, xóa user.
- Xử lý lỗi và validation.
- ESLint + Prettier cho code quality.

## 🛠️ Tech Stack
- Node.js v22+
- Express.js
- PostgreSQL & pg client
- ESLint, Prettier, Nodemon

## 📦 Cài đặt
1. Clone repo: `git clone https://github.com/imjustkhznh/Crud_api.git && cd Crud_api`
2. Cài dependencies: `npm install`
3. Setup DB (PostgreSQL):
   ```sql
   CREATE DATABASE api_crud_db;
   \c api_crud_db
   CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
   ```
4. Config `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=api_crud_db
   DB_PORT=5432
   PORT=3000
   ```
5. Chạy server: `npm run dev` (dev) hoặc `npm start` (prod). Server tại `http://localhost:3000`.

## 📡 API Endpoints
Base URL: `http://localhost:3000`

- **POST /users** - Tạo user  
  Body: `{"name": "Nguyen Van A", "email": "a@example.com"}`  
  Response (201): `{ "id": 1, ... }`

- **GET /users** - Lấy tất cả users  
  Response (200): `[ { "id": 1, ... }, ... ]`

- **GET /users/:id** - Lấy user theo ID  
  Response (200): `{ "id": 1, ... }` hoặc (404): `{ "message": "User not found" }`

- **PUT /users/:id** - Cập nhật user  
  Body: `{"name": "Updated", "email": "updated@example.com"}`  
  Response (200): `{ "id": 1, ... }`

- **DELETE /users/:id** - Xóa user  
  Response (200): `{ "message": "User deleted", "user": { ... } }`

## 🧪 Test API
- Sử dụng Thunder Client (VS Code), Postman, hoặc curl.  
  Ví dụ curl (tạo user):  
  ```bash
  curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com"}'
  ```

## 📁 Cấu trúc Project
```
Crud_api/
├── src/
│   ├── controllers/userController.js  # CRUD logic
│   ├── models/userModel.js            # DB queries
│   ├── routes/userRoutes.js           # Routes
│   ├── db.js                          # DB connection
│   └── index.js                       # Entry point
├── .env & .env.example
├── .eslintrc.js, .prettierrc, .gitignore
├── package.json
└── README.md
```

## 🔧 Scripts
- `npm start`: Production
- `npm run dev`: Development
- `npm run lint`: ESLint
- `npm run format`: Prettier

## ⚠️ Error Handling
| Code | Mô tả |
|------|-------|
| 200  | OK |
| 201  | Created |
| 400  | Bad Request (e.g., email trùng) |
| 404  | Not Found |
| 500  | Server Error |

Ví dụ: `{ "error": "Email already exists" }`

## 🔐 Security
- Không push `.env` lên Git (đã ignore).
- Sử dụng `.env.example` để config.

## 🚀 Deployment
- Trên Railway/Render/Heroku: Tạo DB, set env vars, deploy code.
- Env vars: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, PORT.

## 🤝 Contributing
1. Fork repo.
2. Branch: `git checkout -b feature-name`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature-name`
5. Pull Request.

## 📝 License
MIT License.

## 👤 Author
- GitHub: [@imjustkhznh](https://github.com/imjustkhznh)
- Repo: [Crud_api](https://github.com/imjustkhznh/Crud_api)

## 📮 Contact
Tạo [Issue](https://github.com/imjustkhznh/Crud_api/issues).

---

⭐ Star repo nếu hữu ích! ⭐