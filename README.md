# Node.js Backend Starter Pack (TypeScript + MongoDB)

A robust, production-ready Node.js backend boilerplate built with **Express**, **TypeScript**, and **MongoDB**. This starter pack is designed to be brand-neutral and highly extensible for any backend service.

## 🚀 Key Features

- **TypeScript Core**: Fully typed development experience.
- **Interactive API Documentation**: Real-time Swagger UI documentation.
- **Simplified Authentication**: Direct registration and login flow with JWT token generation and automated welcome emails.
- **RESTful API Design**: Structured routing and controller architecture.
- **Mongoose Integration**: Ready-to-use MongoDB schemas and models.
- **Request Validation**: Robust input validation using **Zod**.
- **Email Integration**: Integrated with **SendPulse** for automated notifications.
- **Advanced Logging**: Structured logging using **Pino** and **Pino-pretty**.
- **API Documentation**: Pre-configured `.http` files for testing with the REST Client extension.
- **Security**: Basic rate limiting and CORS configuration included.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (JWT)
- **Logging**: Pino
- **Email Service**: SendPulse API

## 📁 Project Structure

```text
src/
├── controllers/    # API request handlers
├── docs/           # API testing/documentation (.http files)
├── enums/          # Application-wide enums and constants
├── interfaces/     # TypeScript interfaces and types
├── mails/          # Generic email templates (HTML/CSS)
├── middleware/     # Auth checks, rate limiters, etc.
├── models/         # Mongoose schemas and database logic
├── routes/         # Express route declarations
├── services/       # Business logic and external service integrations
├── utils/          # Database connection, JWT helpers, and logger
└── validation/     # Schema-based request validation (Zod)
```

## ⚙️ Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
# Server
PORT=4000
BASE_URL=/api

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/database

# Security
JWT_SECRET=your_very_secure_random_string

# Email (SendPulse)
SENDPULSE_USER_ID=your_id
SENDPULSE_SECRET=your_secret
SENDER_NAME="API Support"
SENDER_EMAIL=no-reply@yourdomain.com
```

## 🛠️ Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Duplicate `.env.example` (if provided) or create a new `.env` file as shown above.

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Start Production Server**:
   ```bash
   npm start
   ```

## 📖 API Documentation

This project provides two ways to test and view the API documentation:

### 1. Interactive Swagger UI
Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:4000/docs`

This interface allows you to view all available endpoints, their required parameters, and execute requests directly from your browser.

### 2. REST Client (.http files)
For those who prefer testing within VS Code, an `auth.docs.http` file is provided in the `src/docs/` directory. Use the [VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to execute requests directly from the editor.

## 📜 Development Scripts

- `npm run dev`: Hot-reloading development server (`ts-node-dev`).
- `npm run build`: Compiles TypeScript to the `dist/` directory.
- `npm start`: Runs the compiled JavaScript with standard Node.
- `npm run gcp-build`: Standardized build script for cloud platforms like GCP or Render.

---
*Created as a generic starter for building scalable backend services.*
