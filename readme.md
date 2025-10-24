🚀 CRUD API - User Management
RESTful API quản lý users với Node.js, Express và PostgreSQL.
✨ Tính năng

CRUD: Tạo, đọc, cập nhật, xóa user.
Xử lý lỗi và validation.
ESLint + Prettier đảm bảo code quality.

🛠️ Tech Stack

Node.js v22+
Express.js
PostgreSQL
pg (PostgreSQL client)
ESLint, Prettier, Nodemon

📦 Cài đặt

Clone repository:
git clone https://github.com/imjustkhznh/Crud_api.git
cd Crud_api


Cài dependencies:
npm install


Setup PostgreSQL:
CREATE DATABASE api_crud_db;
\c api_crud_db
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Config .env:
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=api_crud_db
DB_PORT=5432
PORT=3000


Chạy server:
npm run dev

Server chạy tại: http://localhost:3000


📡 API Endpoints
Base URL: http://localhost:3000

POST /users - Tạo user{"name": "Nguyen Van A", "email": "a@example.com"}


GET /users - Lấy danh sách users
GET /users/:id - Lấy user theo ID
PUT /users/:id - Cập nhật user
DELETE /users/:id - Xóa user

🧪 Test API

Thunder Client (VS Code) hoặc Postman.
curl ví dụ:curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com"}'



📁 Cấu trúc Project
Crud_api/
├── src/
│   ├── controllers/userController.js
│   ├── models/userModel.js
│   ├── routes/userRoutes.js
│   ├── db.js
│   └── index.js
├── .env
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── package.json
└── README.md

🔧 Scripts
npm start      # Production
npm run dev    # Development
npm run lint   # ESLint
npm run format # Prettier

⚠️ Error Handling

200: OK
201: Created
400: Bad Request
404: Not Found
500: Server Error

🔐 Lưu ý

Không push .env lên GitHub.
Dùng .env.example để config.

🚀 Deployment

Deploy trên Railway/Render/Heroku.
Set environment variables như trong .env.

🤝 Contributing

Fork repo.
Tạo branch: git checkout -b feature-name.
Commit: git commit -m 'Add feature'.
Push: git push origin feature-name.
Mở Pull Request.

📝 License
MIT License
👤 Author

GitHub: @imjustkhznh
Repo: Crud_api

📮 Contact
Tạo Issue nếu có thắc mắc!

⭐ Star repo nếu thấy hữu ích! ⭐