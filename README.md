# Employee Management API

## Description

An employee management software API built with NestJS, featuring authentication, employee CRUD, attendance management, and reporting.

## Features

- **Authentication**: Register, Login, Logout, Forgot Password, Reset Password, Email Verification.
- **Employee Management**: CRUD operations for employees (names, email, employeeIdentifier, phoneNumber).
- **Attendance**: Clock In/Out functionality with email notifications.
- **Reports**: Generate PDF and Excel reports for attendance history, with date filtering.
- **Email Notifications**: Automated emails for welcome, verification, password reset, and attendance actions using queues.

## Stack & Tools

- **Framework**: NestJS v11
- **Database**: MySQL with TypeORM
- **Authentication**: PassportJS (JWT)
- **Email**: Resend (with local fallback), React Email
- **Queues**: Bull (Redis)
- **Reports**: jsPDF, ExcelJS
- **Testing**: Jest
- **Documentation**: Swagger (OpenAPI)

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd employee-management-api
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the root directory (copy from `.env.example` if available) and set the following:
    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=your_password
    DB_NAME=employee_management

    REDIS_HOST=localhost
    REDIS_PORT=6379

    SECRET_KEY=your_secret_key
    
    # Resend API Key (or use 're_123' for local simulation)
    RESEND_API_KEY=your_resend_api_key
    ```

4.  Database Setup:
    Ensure MySQL and Redis are running.
    ```bash
    npm run setup
    # Or manually:
    # npm run db:init
    # npm run db:seed
    ```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

The API will be available at `http://localhost:3000`.
Swagger documentation is available at `http://localhost:3000/api`.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Endpoints

### Auth
- `POST /auth/signup`: Register a new user.
- `POST /auth/login`: Login and receive JWT.
- `POST /auth/verify-account`: Verify email with code.
- `POST /auth/forgot-password`: Request password reset.
- `POST /auth/reset-password`: Reset password with token.

### Users
- `GET /users`: Get all users (Admin only).
- `GET /users/:id`: Get user details.
- `POST /users`: Create a new user (Admin only).
- `PUT /users/:id`: Update user details.
- `DELETE /users/:id`: Delete a user (Admin only).

### Attendance
- `POST /attendance/clock-in`: Record entry time.
- `POST /attendance/clock-out`: Record exit time.
- `GET /attendance/history`: Get own attendance history.
- `GET /attendance/reports/excel`: Download Excel report (supports `startDate` and `endDate` query params).
- `GET /attendance/reports/pdf`: Download PDF report (supports `startDate` and `endDate` query params).
