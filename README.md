# Portfolio Backend (API)

This is the backend API for your portfolio application. It is built using **Node.js**, **Express**, and **Prisma** (or Mongoose, depending on your DB choice). It handles authentication, content management (blogs, projects), and data persistence.

---

### Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Setup & Installation](#setup--installation)  

---

### Features

- User authentication & authorization (login, token refresh, etc.)  
- CRUD APIs for:
  - Blogs  
  - Projects  
- Admin role (owner) seeded for initial access  
- Validation and error handling  
- Secure password hashing (bcrypt)  
- JWT-based token issuance & verification  

---

### Tech Stack

- Node.js  
- Express  
- TypeScript
- Prisma ORM (with PostgreSQL, MySQL, or SQLite) *or* Mongoose + MongoDB  
- bcrypt  
- jsonwebtoken  
- dotenv  

---

### Setup & Installation

1. Clone the repo (or in monorepo, go into backend folder)  

```bash
   git clone <repository-url>
   cd B5A7/backend
```

2. Install dependencies

```bash
  bun install
```

3. Create a .env file in the backend folder, e.g.:

```bash
  DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
  JWT_SECRET=your_jwt_secret_key
  JWT_EXPIRES_IN=1h
  REFRESH_TOKEN_EXPIRES_IN=7d
  PORT=4000
```

4. Run database migrations / generate client

```bash
  bunx prisma migrate dev
  bunx prisma generate
```

5. Start the server

```bash
  bun run dev
```