import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../src/app";

let mongoServer: MongoMemoryServer;
let token: string;
let projectId: string;
let taskId: string;

beforeAll(async () => {
    process.env.JWT_SECRET = "test_jwt_secret";
    process.env.JWT_EXPIRES_IN = "7d";
    process.env.NODE_ENV = "test";

    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Project & Task Management API", () => {
    it("registers a user", async () => {
        const response = await request(app).post("/api/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "Password123!",
        });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();

        token = response.body.data.token;
    });

    it("logs in a user", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "Password123!",
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();

        token = response.body.data.token;
    });

    it("rejects protected route without token", async () => {
        const response = await request(app).get("/api/projects");

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    it("creates a project", async () => {
        const response = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Project",
                description: "Project created during tests",
                status: "active",
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.project.id).toBeDefined();

        projectId = response.body.data.project.id;
    });

    it("gets projects for authenticated user", async () => {
        const response = await request(app)
            .get("/api/projects")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.projects)).toBe(true);
    });

    it("creates a task under a project", async () => {
        const response = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Task",
                description: "Task created during tests",
                status: "pending",
                priority: "high",
                dueDate: "2026-06-30",
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.task.id).toBeDefined();

        taskId = response.body.data.task.id;
    });

    it("gets tasks with filters", async () => {
        const response = await request(app)
            .get(
                `/api/projects/${projectId}/tasks?status=pending&priority=high`,
            )
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.tasks)).toBe(true);
    });

    it("updates a task", async () => {
        const response = await request(app)
            .patch(`/api/projects/${projectId}/tasks/${taskId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                status: "done",
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.task.status).toBe("done");
    });

    it("deletes a task", async () => {
        const response = await request(app)
            .delete(`/api/projects/${projectId}/tasks/${taskId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});
