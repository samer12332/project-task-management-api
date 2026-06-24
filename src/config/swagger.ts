import swaggerJSDoc = require("swagger-jsdoc");

const options: swaggerJSDoc.OAS3Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Project Task Management API",
            version: "1.0.0",
            description:
                "REST API documentation for the Project & Task Management System built with Express.js, TypeScript, MongoDB, and Mongoose.",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development server",
            },
        ],
        tags: [
            { name: "Health", description: "API health check endpoints" },
            { name: "Auth", description: "Authentication endpoints" },
            { name: "Projects", description: "Project management endpoints" },
            { name: "Tasks", description: "Task management endpoints" },
            { name: "Admin", description: "Admin-only reporting endpoints" },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Provide a valid JWT bearer token.",
                },
            },
            parameters: {
                ProjectIdParam: {
                    name: "projectId",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the project",
                    schema: {
                        type: "string",
                        example: "665f3efebf7d0cb1f4d98920",
                    },
                },
                TaskIdParam: {
                    name: "taskId",
                    in: "path",
                    required: true,
                    description: "MongoDB ObjectId of the task",
                    schema: {
                        type: "string",
                        example: "665f3efebf7d0cb1f4d98930",
                    },
                },
                PageParam: {
                    name: "page",
                    in: "query",
                    description: "Page number for paginated results",
                    schema: {
                        type: "integer",
                        minimum: 1,
                        default: 1,
                    },
                },
                LimitParam: {
                    name: "limit",
                    in: "query",
                    description: "Number of items per page",
                    schema: {
                        type: "integer",
                        minimum: 1,
                        maximum: 100,
                        default: 10,
                    },
                },
                SortByProjectsParam: {
                    name: "sortBy",
                    in: "query",
                    description: "Project field used for sorting",
                    schema: {
                        type: "string",
                        enum: ["createdAt", "updatedAt", "title", "status"],
                    },
                },
                SortByTasksParam: {
                    name: "sortBy",
                    in: "query",
                    description: "Task field used for sorting",
                    schema: {
                        type: "string",
                        enum: [
                            "createdAt",
                            "updatedAt",
                            "title",
                            "status",
                            "priority",
                            "dueDate",
                        ],
                    },
                },
                SortByAdminParam: {
                    name: "sortBy",
                    in: "query",
                    description: "Admin list field used for sorting",
                    schema: {
                        type: "string",
                        enum: [
                            "createdAt",
                            "updatedAt",
                            "name",
                            "email",
                            "title",
                            "status",
                            "priority",
                        ],
                    },
                },
                SortOrderParam: {
                    name: "sortOrder",
                    in: "query",
                    description: "Sort direction",
                    schema: {
                        type: "string",
                        enum: ["asc", "desc"],
                        default: "desc",
                    },
                },
                ProjectStatusParam: {
                    name: "status",
                    in: "query",
                    description: "Filter projects by status",
                    schema: {
                        type: "string",
                        enum: ["planning", "active", "completed", "archived"],
                    },
                },
                TaskStatusParam: {
                    name: "status",
                    in: "query",
                    description: "Filter tasks by status",
                    schema: {
                        type: "string",
                        enum: ["pending", "in_progress", "done"],
                    },
                },
                TaskPriorityParam: {
                    name: "priority",
                    in: "query",
                    description: "Filter tasks by priority",
                    schema: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                    },
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "665f3efebf7d0cb1f4d98910" },
                        name: { type: "string", example: "Samer Yousry" },
                        email: {
                            type: "string",
                            format: "email",
                            example: "samer@example.com",
                        },
                        role: {
                            type: "string",
                            enum: ["admin", "member"],
                            example: "member",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-06-24T12:00:00.000Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-06-24T12:00:00.000Z",
                        },
                    },
                    required: [
                        "id",
                        "name",
                        "email",
                        "role",
                        "createdAt",
                        "updatedAt",
                    ],
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        user: {
                            $ref: "#/components/schemas/User",
                        },
                        token: {
                            type: "string",
                            example:
                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.signature",
                        },
                    },
                    required: ["user", "token"],
                },
                Project: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "665f3efebf7d0cb1f4d98920" },
                        title: {
                            type: "string",
                            example: "Electro Pi Technical Test",
                        },
                        description: {
                            type: "string",
                            example: "Project and task management backend API",
                            nullable: true,
                        },
                        status: {
                            type: "string",
                            enum: ["planning", "active", "completed", "archived"],
                            example: "active",
                        },
                        owner: {
                            type: "string",
                            example: "665f3efebf7d0cb1f4d98910",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-06-24T12:00:00.000Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-06-24T12:30:00.000Z",
                        },
                    },
                    required: [
                        "id",
                        "title",
                        "status",
                        "owner",
                        "createdAt",
                        "updatedAt",
                    ],
                },
                Task: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "665f3efebf7d0cb1f4d98930" },
                        title: { type: "string", example: "Build task CRUD" },
                        description: {
                            type: "string",
                            example: "Implement task endpoints under projects",
                            nullable: true,
                        },
                        status: {
                            type: "string",
                            enum: ["pending", "in_progress", "done"],
                            example: "pending",
                        },
                        priority: {
                            type: "string",
                            enum: ["low", "medium", "high"],
                            example: "high",
                        },
                        dueDate: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            example: "2026-06-30T00:00:00.000Z",
                        },
                        project: {
                            type: "string",
                            example: "665f3efebf7d0cb1f4d98920",
                        },
                        owner: {
                            type: "string",
                            example: "665f3efebf7d0cb1f4d98910",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-06-24T12:00:00.000Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-06-24T12:30:00.000Z",
                        },
                    },
                    required: [
                        "id",
                        "title",
                        "status",
                        "priority",
                        "project",
                        "owner",
                        "createdAt",
                        "updatedAt",
                    ],
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        status: {
                            type: "string",
                            enum: ["fail", "error"],
                            example: "fail",
                        },
                        message: {
                            type: "string",
                            example: "Project not found",
                        },
                    },
                    required: ["success", "status", "message"],
                },
                Pagination: {
                    type: "object",
                    properties: {
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        total: { type: "integer", example: 25 },
                        totalPages: { type: "integer", example: 3 },
                    },
                    required: ["page", "limit", "total", "totalPages"],
                },
                RegisterRequest: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            minLength: 2,
                            maxLength: 50,
                            example: "Samer Yousry",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "samer@example.com",
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            format: "password",
                            example: "Password123!",
                        },
                    },
                    required: ["name", "email", "password"],
                },
                LoginRequest: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "samer@example.com",
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "Password123!",
                        },
                    },
                    required: ["email", "password"],
                },
                CreateProjectRequest: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            minLength: 2,
                            maxLength: 100,
                            example: "Electro Pi Technical Test",
                        },
                        description: {
                            type: "string",
                            maxLength: 1000,
                            example: "Project and task management backend API",
                        },
                        status: {
                            type: "string",
                            enum: ["planning", "active", "completed", "archived"],
                            example: "active",
                        },
                    },
                    required: ["title"],
                },
                UpdateProjectRequest: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            minLength: 2,
                            maxLength: 100,
                            example: "Updated Project Title",
                        },
                        description: {
                            type: "string",
                            maxLength: 1000,
                            example: "Updated project description",
                        },
                        status: {
                            type: "string",
                            enum: ["planning", "active", "completed", "archived"],
                            example: "completed",
                        },
                    },
                },
                CreateTaskRequest: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            minLength: 2,
                            maxLength: 100,
                            example: "Build task CRUD",
                        },
                        description: {
                            type: "string",
                            maxLength: 1000,
                            example: "Implement task endpoints under projects",
                        },
                        status: {
                            type: "string",
                            enum: ["pending", "in_progress", "done"],
                            example: "pending",
                        },
                        priority: {
                            type: "string",
                            enum: ["low", "medium", "high"],
                            example: "high",
                        },
                        dueDate: {
                            type: "string",
                            format: "date",
                            example: "2026-06-30",
                        },
                    },
                    required: ["title"],
                },
                UpdateTaskRequest: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            minLength: 2,
                            maxLength: 100,
                            example: "Refine task CRUD",
                        },
                        description: {
                            type: "string",
                            maxLength: 1000,
                            example: "Updated task description",
                        },
                        status: {
                            type: "string",
                            enum: ["pending", "in_progress", "done"],
                            example: "done",
                        },
                        priority: {
                            type: "string",
                            enum: ["low", "medium", "high"],
                            example: "medium",
                        },
                        dueDate: {
                            type: "string",
                            format: "date",
                            example: "2026-07-01",
                        },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: "Authentication failed",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },
                ForbiddenError: {
                    description: "Authorization failed",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },
                NotFoundError: {
                    description: "Resource not found",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },
                ValidationError: {
                    description: "Validation failed",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse",
                            },
                        },
                    },
                },
            },
        },
        paths: {
            "/health": {
                get: {
                    tags: ["Health"],
                    summary: "Health check",
                    description: "Returns a simple status payload indicating the API is running.",
                    responses: {
                        "200": {
                            description: "API is healthy",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "API is running",
                                            },
                                        },
                                        required: ["success", "message"],
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/auth/register": {
                post: {
                    tags: ["Auth"],
                    summary: "Register a new user",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/RegisterRequest",
                                },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "User registered successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "User registered successfully",
                                            },
                                            data: {
                                                $ref: "#/components/schemas/AuthResponse",
                                            },
                                        },
                                        required: ["success", "message", "data"],
                                    },
                                },
                            },
                        },
                        "409": {
                            description: "Email is already registered",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/ErrorResponse",
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                    },
                },
            },
            "/api/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "Login a user",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/LoginRequest",
                                },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "User logged in successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "User logged in successfully",
                                            },
                                            data: {
                                                $ref: "#/components/schemas/AuthResponse",
                                            },
                                        },
                                        required: ["success", "message", "data"],
                                    },
                                },
                            },
                        },
                        "401": {
                            description: "Invalid email or password",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/ErrorResponse",
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                    },
                },
            },
            "/api/auth/me": {
                get: {
                    tags: ["Auth"],
                    summary: "Get current authenticated user",
                    security: [{ BearerAuth: [] }],
                    responses: {
                        "200": {
                            description: "Authenticated user details",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    user: {
                                                        $ref: "#/components/schemas/User",
                                                    },
                                                },
                                                required: ["user"],
                                            },
                                        },
                                        required: ["success", "data"],
                                    },
                                },
                            },
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                    },
                },
            },
            "/api/projects": {
                post: {
                    tags: ["Projects"],
                    summary: "Create a project",
                    security: [{ BearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/CreateProjectRequest",
                                },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Project created successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Project created successfully",
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    project: {
                                                        $ref: "#/components/schemas/Project",
                                                    },
                                                },
                                                required: ["project"],
                                            },
                                        },
                                        required: ["success", "message", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                    },
                },
                get: {
                    tags: ["Projects"],
                    summary: "List authenticated user's projects",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { $ref: "#/components/parameters/PageParam" },
                        { $ref: "#/components/parameters/LimitParam" },
                        { $ref: "#/components/parameters/SortByProjectsParam" },
                        { $ref: "#/components/parameters/SortOrderParam" },
                        { $ref: "#/components/parameters/ProjectStatusParam" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated list of projects",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    projects: {
                                                        type: "array",
                                                        items: {
                                                            $ref: "#/components/schemas/Project",
                                                        },
                                                    },
                                                    pagination: {
                                                        $ref: "#/components/schemas/Pagination",
                                                    },
                                                },
                                                required: ["projects", "pagination"],
                                            },
                                        },
                                        required: ["success", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                    },
                },
            },
            "/api/projects/{projectId}": {
                get: {
                    tags: ["Projects"],
                    summary: "Get a project by ID",
                    security: [{ BearerAuth: [] }],
                    parameters: [{ $ref: "#/components/parameters/ProjectIdParam" }],
                    responses: {
                        "200": {
                            description: "Project details",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    project: {
                                                        $ref: "#/components/schemas/Project",
                                                    },
                                                },
                                                required: ["project"],
                                            },
                                        },
                                        required: ["success", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "404": {
                            $ref: "#/components/responses/NotFoundError",
                        },
                    },
                },
                patch: {
                    tags: ["Projects"],
                    summary: "Update a project",
                    security: [{ BearerAuth: [] }],
                    parameters: [{ $ref: "#/components/parameters/ProjectIdParam" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/UpdateProjectRequest",
                                },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Project updated successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Project updated successfully",
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    project: {
                                                        $ref: "#/components/schemas/Project",
                                                    },
                                                },
                                                required: ["project"],
                                            },
                                        },
                                        required: ["success", "message", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "404": {
                            $ref: "#/components/responses/NotFoundError",
                        },
                    },
                },
                delete: {
                    tags: ["Projects"],
                    summary: "Delete a project",
                    security: [{ BearerAuth: [] }],
                    parameters: [{ $ref: "#/components/parameters/ProjectIdParam" }],
                    responses: {
                        "200": {
                            description: "Project deleted successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Project deleted successfully",
                                            },
                                        },
                                        required: ["success", "message"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "404": {
                            $ref: "#/components/responses/NotFoundError",
                        },
                    },
                },
            },
            "/api/projects/{projectId}/tasks": {
                post: {
                    tags: ["Tasks"],
                    summary: "Create a task under a project",
                    security: [{ BearerAuth: [] }],
                    parameters: [{ $ref: "#/components/parameters/ProjectIdParam" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/CreateTaskRequest",
                                },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Task created successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Task created successfully",
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    task: {
                                                        $ref: "#/components/schemas/Task",
                                                    },
                                                },
                                                required: ["task"],
                                            },
                                        },
                                        required: ["success", "message", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "404": {
                            $ref: "#/components/responses/NotFoundError",
                        },
                    },
                },
                get: {
                    tags: ["Tasks"],
                    summary: "List tasks for a project",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { $ref: "#/components/parameters/ProjectIdParam" },
                        { $ref: "#/components/parameters/PageParam" },
                        { $ref: "#/components/parameters/LimitParam" },
                        { $ref: "#/components/parameters/SortByTasksParam" },
                        { $ref: "#/components/parameters/SortOrderParam" },
                        { $ref: "#/components/parameters/TaskStatusParam" },
                        { $ref: "#/components/parameters/TaskPriorityParam" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated list of tasks",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    tasks: {
                                                        type: "array",
                                                        items: {
                                                            $ref: "#/components/schemas/Task",
                                                        },
                                                    },
                                                    pagination: {
                                                        $ref: "#/components/schemas/Pagination",
                                                    },
                                                },
                                                required: ["tasks", "pagination"],
                                            },
                                        },
                                        required: ["success", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "404": {
                            $ref: "#/components/responses/NotFoundError",
                        },
                    },
                },
            },
            "/api/projects/{projectId}/tasks/{taskId}": {
                get: {
                    tags: ["Tasks"],
                    summary: "Get a task by ID",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { $ref: "#/components/parameters/ProjectIdParam" },
                        { $ref: "#/components/parameters/TaskIdParam" },
                    ],
                    responses: {
                        "200": {
                            description: "Task details",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    task: {
                                                        $ref: "#/components/schemas/Task",
                                                    },
                                                },
                                                required: ["task"],
                                            },
                                        },
                                        required: ["success", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "404": {
                            $ref: "#/components/responses/NotFoundError",
                        },
                    },
                },
                patch: {
                    tags: ["Tasks"],
                    summary: "Update a task",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { $ref: "#/components/parameters/ProjectIdParam" },
                        { $ref: "#/components/parameters/TaskIdParam" },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/UpdateTaskRequest",
                                },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Task updated successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Task updated successfully",
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    task: {
                                                        $ref: "#/components/schemas/Task",
                                                    },
                                                },
                                                required: ["task"],
                                            },
                                        },
                                        required: ["success", "message", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "404": {
                            $ref: "#/components/responses/NotFoundError",
                        },
                    },
                },
                delete: {
                    tags: ["Tasks"],
                    summary: "Delete a task",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { $ref: "#/components/parameters/ProjectIdParam" },
                        { $ref: "#/components/parameters/TaskIdParam" },
                    ],
                    responses: {
                        "200": {
                            description: "Task deleted successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: {
                                                type: "string",
                                                example: "Task deleted successfully",
                                            },
                                        },
                                        required: ["success", "message"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "404": {
                            $ref: "#/components/responses/NotFoundError",
                        },
                    },
                },
            },
            "/api/admin/users": {
                get: {
                    tags: ["Admin"],
                    summary: "List all users",
                    description: "Returns paginated users for administrators only.",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { $ref: "#/components/parameters/PageParam" },
                        { $ref: "#/components/parameters/LimitParam" },
                        { $ref: "#/components/parameters/SortByAdminParam" },
                        { $ref: "#/components/parameters/SortOrderParam" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated list of users",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    users: {
                                                        type: "array",
                                                        items: {
                                                            $ref: "#/components/schemas/User",
                                                        },
                                                    },
                                                    pagination: {
                                                        $ref: "#/components/schemas/Pagination",
                                                    },
                                                },
                                                required: ["users", "pagination"],
                                            },
                                        },
                                        required: ["success", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "403": {
                            $ref: "#/components/responses/ForbiddenError",
                        },
                    },
                },
            },
            "/api/admin/projects": {
                get: {
                    tags: ["Admin"],
                    summary: "List all projects",
                    description: "Returns paginated projects for administrators only.",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { $ref: "#/components/parameters/PageParam" },
                        { $ref: "#/components/parameters/LimitParam" },
                        { $ref: "#/components/parameters/SortByAdminParam" },
                        { $ref: "#/components/parameters/SortOrderParam" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated list of projects",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    projects: {
                                                        type: "array",
                                                        items: {
                                                            $ref: "#/components/schemas/Project",
                                                        },
                                                    },
                                                    pagination: {
                                                        $ref: "#/components/schemas/Pagination",
                                                    },
                                                },
                                                required: ["projects", "pagination"],
                                            },
                                        },
                                        required: ["success", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "403": {
                            $ref: "#/components/responses/ForbiddenError",
                        },
                    },
                },
            },
            "/api/admin/tasks": {
                get: {
                    tags: ["Admin"],
                    summary: "List all tasks",
                    description: "Returns paginated tasks for administrators only.",
                    security: [{ BearerAuth: [] }],
                    parameters: [
                        { $ref: "#/components/parameters/PageParam" },
                        { $ref: "#/components/parameters/LimitParam" },
                        { $ref: "#/components/parameters/SortByAdminParam" },
                        { $ref: "#/components/parameters/SortOrderParam" },
                    ],
                    responses: {
                        "200": {
                            description: "Paginated list of tasks",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    tasks: {
                                                        type: "array",
                                                        items: {
                                                            $ref: "#/components/schemas/Task",
                                                        },
                                                    },
                                                    pagination: {
                                                        $ref: "#/components/schemas/Pagination",
                                                    },
                                                },
                                                required: ["tasks", "pagination"],
                                            },
                                        },
                                        required: ["success", "data"],
                                    },
                                },
                            },
                        },
                        "400": {
                            $ref: "#/components/responses/ValidationError",
                        },
                        "401": {
                            $ref: "#/components/responses/UnauthorizedError",
                        },
                        "403": {
                            $ref: "#/components/responses/ForbiddenError",
                        },
                    },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
