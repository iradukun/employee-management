# Employee Management System API

A robust NestJS-based API for managing employees, attendance, and reports.

## Features

- **Authentication**: Secure Signup, Login, Email Verification, and Password Reset using JWT and Email OTPs.
- **Employee Management**: CRUD operations for employees (Users) with Role-Based Access Control (RBAC).
- **Attendance Tracking**: Clock-in/Clock-out functionality with email notifications via Bull Queues (Redis).
- **Reports**: Generate and download Attendance reports in Excel and PDF formats.
- **Security**: Password hashing (Bcrypt), JWT strategies, and Input Validation (Class-Validator).
- **Documentation**: Interactive API documentation via Swagger.

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL (via TypeORM)
- **Queue**: Bull (Redis) for background jobs (email sending)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger (OpenAPI)
- **Tools**: pnpm, Docker (optional for DB/Redis)

## Prerequisites

- Node.js (v18+)
- pnpm
- MySQL
- Redis (for Email Queue)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory based on `.env.example` (or use the provided variables below):

    ```env
    # Database
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=your_password
    DB_DATABASE=academic_bridge_db

    # JWT
    JWT_SECRET=super-secret-key
    JWT_EXPIRES_IN=1d

    # Email (SMTP)
    MAIL_HOST=smtp.example.com
    MAIL_USER=user@example.com
    MAIL_PASSWORD=password
    MAIL_FROM=noreply@example.com

    # Redis (for Bull Queue)
    REDIS_HOST=localhost
    REDIS_PORT=6379

    # Admin Setup
    ADMIN_KEY=secret_admin_key_for_seeding
    ```

4.  **Run Migrations (Synchronization):**
    This project uses `synchronize: true` for development. Ensure your database exists.

## Running the Application

### Development Mode
```bash
pnpm run start:dev
```

### Production Mode
```bash
pnpm run build
pnpm run start:prod
```

## Running Tests

### Unit Tests
```bash
pnpm run test
```

### E2E Tests
```bash
pnpm run test:e2e
```

## API Documentation

Once the application is running, visit:
`http://localhost:3000/api`

## Key Endpoints

### Auth
- `POST /auth/signup`: Register a new user.
- `POST /auth/login`: Login and receive JWT.
- `POST /auth/verify-email`: Verify account using OTP.
- `POST /auth/forgot-password`: Request password reset.
- `POST /auth/reset-password`: Reset password using OTP.

### Users (Protected)
- `GET /users`: List all users (Admin only).
- `GET /users/:id`: Get user details (Admin or Self).
- `PUT /users/:id`: Update user details (Admin or Self).
- `DELETE /users/:id`: Delete user (Admin only).

### Attendance (Protected)
- `POST /attendance/clock-in`: Record entry time.
- `POST /attendance/clock-out`: Record exit time.
- `GET /attendance/history`: View personal attendance history.
- `GET /attendance/reports/excel`: Download Excel report (Admin/All).
- `GET /attendance/reports/pdf`: Download PDF report (Admin/All).

## Deployment

The application is container-ready. Ensure environment variables are set in your deployment platform (e.g., Render, Railway, AWS).

## License

[MIT](LICENSE)
