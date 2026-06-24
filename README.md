# Project Task Management API

A RESTful API for a Project & Task Management System built with Node.js, Express.js, TypeScript, MongoDB, and Mongoose.

This project was built as a backend technical assessment. It supports authentication, project management, task management, validation, error handling, pagination, sorting, role-based access control, seed data, Docker Compose support, and automated tests.

Swagger docs URL: `http://localhost:5000/api/docs`

Postman collection is also included in [`postman/project-task-management-api.postman_collection.json`](./postman/project-task-management-api.postman_collection.json).

---

## Tech Stack

- Node.js v18+
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- express-validator
- Jest
- Supertest
- mongodb-memory-server
- Docker Compose
- Postman

## Published POSTMAN

https://documenter.getpostman.com/view/33114601/2sBXwwo8Qv

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Password hashing using bcrypt
- Get current authenticated user

### Projects

- Create a project
- Get all projects for the authenticated user
- Get a single project by ID
- Update project details
- Delete a project
- Filter projects by status
- Pagination and sorting

### Tasks

- Create a task under a specific project
- Get all tasks for a specific project
- Get a single task by ID
- Update task details
- Delete a task
- Filter tasks by status
- Filter tasks by priority
- Pagination and sorting

### Bonus Features

- TypeScript
- Role-based access control: Admin / Member
- Admin-only endpoints
- Jest/Supertest tests
- Docker Compose setup for local MongoDB
- Seed script with demo users and demo data

---

## User Roles

### Member

A member can:

- Register and login
- Create projects
- Manage only their own projects
- Create and manage tasks inside their own projects

### Admin

An admin can:

- Access all users
- Access all projects
- Access all tasks

Admin-only endpoints are protected using JWT authentication and role-based authorization.

---

## Project Structure

```txt
src/
├── config/
│   ├── db.ts
│   └── env.ts
├── controllers/
│   ├── admin.controller.ts
│   ├── auth.controller.ts
│   ├── project.controller.ts
│   └── task.controller.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── notFound.middleware.ts
│   ├── role.middleware.ts
│   └── validate.middleware.ts
├── models/
│   ├── project.model.ts
│   ├── task.model.ts
│   └── user.model.ts
├── routes/
│   ├── admin.routes.ts
│   ├── auth.routes.ts
│   ├── project.routes.ts
│   └── task.routes.ts
├── services/
│   ├── admin.service.ts
│   ├── auth.service.ts
│   ├── project.service.ts
│   └── task.service.ts
├── types/
│   └── express.d.ts
├── utils/
│   ├── AppError.ts
│   ├── catchAsync.ts
│   ├── jwt.ts
│   └── pagination.ts
├── validators/
│   ├── admin.validator.ts
│   ├── auth.validator.ts
│   ├── project.validator.ts
│   └── task.validator.ts
├── app.ts
├── seed.ts
└── server.ts
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project_task_management

JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRES_IN=7d
```

You can also use local MongoDB with Docker Compose:

```env
MONGO_URI=mongodb://localhost:27017/project_task_management
```

---

## Installation

```bash
npm install
```

---

## Run Locally

### Development

```bash
npm run dev
```

The server will run on:

```txt
http://localhost:5000
```

Health check:

```txt
GET /health
```

Swagger docs:

```txt
http://localhost:5000/api/docs
```

---

## Build

```bash
npm run build
```

---

## Start Production Build

```bash
npm start
```

---

## Seed Database

The seed script creates:

- Admin user
- Member user
- Demo project
- Demo task

Run:

```bash
npm run seed
```

Seeded accounts:

```txt
Admin:
email: admin@example.com
password: Password123!

Member:
email: member@example.com
password: Password123!
```

---

## Docker Compose

Docker Compose is included as an optional way to run MongoDB locally.

Start MongoDB locally:

```bash
docker compose up -d
```

Stop MongoDB:

```bash
docker compose down
```

If you are using MongoDB Atlas, you do not need to run Docker Compose.

---

## API Endpoints

### Auth Routes

| Method | Endpoint             | Description                    | Auth |
| ------ | -------------------- | ------------------------------ | ---- |
| POST   | `/api/auth/register` | Register new user              | No   |
| POST   | `/api/auth/login`    | Login user                     | No   |
| GET    | `/api/auth/me`       | Get current authenticated user | Yes  |

---

### Project Routes

| Method | Endpoint                   | Description                       | Auth |
| ------ | -------------------------- | --------------------------------- | ---- |
| POST   | `/api/projects`            | Create project                    | Yes  |
| GET    | `/api/projects`            | Get authenticated user's projects | Yes  |
| GET    | `/api/projects/:projectId` | Get single project                | Yes  |
| PATCH  | `/api/projects/:projectId` | Update project                    | Yes  |
| DELETE | `/api/projects/:projectId` | Delete project                    | Yes  |

Project query examples:

```txt
GET /api/projects?page=1&limit=10
GET /api/projects?status=active
GET /api/projects?sortBy=createdAt&sortOrder=desc
```

---

### Task Routes

| Method | Endpoint                                 | Description                 | Auth |
| ------ | ---------------------------------------- | --------------------------- | ---- |
| POST   | `/api/projects/:projectId/tasks`         | Create task under a project | Yes  |
| GET    | `/api/projects/:projectId/tasks`         | Get tasks for a project     | Yes  |
| GET    | `/api/projects/:projectId/tasks/:taskId` | Get single task             | Yes  |
| PATCH  | `/api/projects/:projectId/tasks/:taskId` | Update task                 | Yes  |
| DELETE | `/api/projects/:projectId/tasks/:taskId` | Delete task                 | Yes  |

Task query examples:

```txt
GET /api/projects/:projectId/tasks?page=1&limit=10
GET /api/projects/:projectId/tasks?status=pending
GET /api/projects/:projectId/tasks?priority=high
GET /api/projects/:projectId/tasks?sortBy=dueDate&sortOrder=asc
```

---

### Admin Routes

Admin routes require:

- Valid JWT token
- User role must be `admin`

| Method | Endpoint              | Description      | Auth | Role  |
| ------ | --------------------- | ---------------- | ---- | ----- |
| GET    | `/api/admin/users`    | Get all users    | Yes  | Admin |
| GET    | `/api/admin/projects` | Get all projects | Yes  | Admin |
| GET    | `/api/admin/tasks`    | Get all tasks    | Yes  | Admin |

Admin query examples:

```txt
GET /api/admin/users?page=1&limit=10
GET /api/admin/projects?sortBy=createdAt&sortOrder=desc
GET /api/admin/tasks?page=1&limit=10
```

---

## Request Examples

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
    "name": "Samer Yousry",
    "email": "samer@example.com",
    "password": "Password123!"
}
```

---

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
    "email": "samer@example.com",
    "password": "Password123!"
}
```

---

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN
```

---

### Create Project

```http
POST /api/projects
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
    "title": "Electro Pi Technical Test",
    "description": "Project and task management backend API",
    "status": "active"
}
```

---

### Update Project

```http
PATCH /api/projects/PROJECT_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
    "title": "Updated Project Title",
    "status": "completed"
}
```

---

### Create Task

```http
POST /api/projects/PROJECT_ID/tasks
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
    "title": "Build task CRUD",
    "description": "Implement task endpoints under projects",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-06-30"
}
```

---

### Update Task

```http
PATCH /api/projects/PROJECT_ID/tasks/TASK_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
    "status": "done",
    "priority": "medium"
}
```

---

## Testing

Run tests:

```bash
npm test
```

The tests cover:

- User registration
- User login
- Protected route without token
- Project creation
- Getting user projects
- Task creation
- Task filtering
- Task update
- Task deletion

---

## Validation

Input validation is handled using `express-validator`.

Invalid requests return a consistent error response:

```json
{
    "success": false,
    "status": "fail",
    "message": "Validation error message"
}
```

---

## Error Handling

The API uses centralized error handling for:

- Validation errors
- Invalid MongoDB IDs
- Duplicate email
- Unauthorized access
- Forbidden access
- Not found resources
- Internal server errors

Example error response:

```json
{
    "success": false,
    "status": "fail",
    "message": "Project not found"
}
```

---

## Postman Collection

A Postman collection can be used to manually test all endpoints.

Recommended collection structure:

```txt
Auth
├── Register
├── Login
└── Get Me

Projects
├── Create Project
├── Get Projects
├── Get Single Project
├── Update Project
└── Delete Project

Tasks
├── Create Task
├── Get Tasks
├── Get Single Task
├── Update Task
└── Delete Task

Admin
├── Get All Users
├── Get All Projects
└── Get All Tasks
```

Recommended Postman environment variables:

```txt
baseUrl=http://localhost:5000
token=YOUR_JWT_TOKEN
projectId=PROJECT_ID
taskId=TASK_ID
```

---

## Important Notes

- All project and task endpoints require authentication.
- Members can only access their own projects and tasks.
- Admin endpoints are protected by role-based access control.
- MongoDB Atlas is supported through `MONGO_URI`.
- Docker Compose is included for optional local MongoDB usage.
- The seed script is included to create test users and demo data.
- The project uses layered architecture: routes → controllers → services → models.
