# CRUD API - User Management

RESTful API for user management with Node.js, Express, and MySQL.

## Tech Stack

- Node.js v22+
- Express.js
- MySQL (mysql2)
- ESLint, Prettier, Nodemon

## Installation

1. Clone repo:
```bash
git clone https://github.com/imjustkhznh/Crud_api.git
cd Crud_api
```

2. Install dependencies:
```bash
npm install
```

3. Setup MySQL database:
```sql
CREATE DATABASE api_crud_db;
USE api_crud_db;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Create `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=api_crud_db
DB_PORT=3306
PORT=3000
```

5. Run server:
```bash
npm run dev    # development
npm start      # production
```

Server runs at `http://localhost:3000`

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | - |
| GET | `/users/:id` | Get user by ID | - |
| POST | `/users` | Create user | `{"name": "...", "email": "..."}` |
| PUT | `/users/:id` | Update user | `{"name": "...", "email": "..."}` |
| DELETE | `/users/:id` | Delete user | - |

## Testing with Thunder Client

1. Install Thunder Client extension in VS Code/Cursor
2. Click Thunder Client icon in sidebar
3. Create new request
4. Select method and enter URL
5. For POST/PUT: go to Body tab → select JSON → enter data
6. Click Send

Example POST request:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Scripts

- `npm start` - Production mode
- `npm run dev` - Development mode (nodemon)
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

## Error Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (e.g., duplicate email) |
| 404 | Not Found |
| 500 | Internal Server Error |

## License

MIT
