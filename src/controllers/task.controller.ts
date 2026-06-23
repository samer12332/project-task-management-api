import { Request, Response } from "express";
import { TaskPriority, TaskStatus } from "../models/task.model";
import {
    createTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateTask,
} from "../services/task.service";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

function getAuthenticatedUserId(req: Request): string {
    if (!req.user) {
        throw new AppError("Authentication required", 401);
    }

    return req.user.id;
}

function getProjectIdParam(req: Request): string {
    const { projectId } = req.params;

    if (typeof projectId !== "string") {
        throw new AppError("Project ID is required", 400);
    }

    return projectId;
}

function getTaskIdParam(req: Request): string {
    const { taskId } = req.params;

    if (typeof taskId !== "string") {
        throw new AppError("Task ID is required", 400);
    }

    return taskId;
}

function getStringQueryValue(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
}

function getTaskListQuery(req: Request) {
    const query: {
        page?: string;
        limit?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        status?: TaskStatus;
        priority?: TaskPriority;
    } = {};

    const page = getStringQueryValue(req.query.page);
    const limit = getStringQueryValue(req.query.limit);
    const sortBy = getStringQueryValue(req.query.sortBy);
    const sortOrder = getStringQueryValue(req.query.sortOrder);
    const status = getStringQueryValue(req.query.status);
    const priority = getStringQueryValue(req.query.priority);

    if (page !== undefined) {
        query.page = page;
    }

    if (limit !== undefined) {
        query.limit = limit;
    }

    if (sortBy !== undefined) {
        query.sortBy = sortBy;
    }

    if (sortOrder === "asc" || sortOrder === "desc") {
        query.sortOrder = sortOrder;
    }

    if (status === "pending" || status === "in_progress" || status === "done") {
        query.status = status;
    }

    if (priority === "low" || priority === "medium" || priority === "high") {
        query.priority = priority;
    }

    return query;
}

export const createTaskController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const projectId = getProjectIdParam(req);

        const task = await createTask(userId, projectId, req.body);

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: {
                task,
            },
        });
    },
);

export const getTasksController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const projectId = getProjectIdParam(req);
        const query = getTaskListQuery(req);

        const result = await getTasks(userId, projectId, query);

        res.status(200).json({
            success: true,
            data: result,
        });
    },
);

export const getTaskByIdController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const projectId = getProjectIdParam(req);
        const taskId = getTaskIdParam(req);

        const task = await getTaskById(userId, projectId, taskId);

        res.status(200).json({
            success: true,
            data: {
                task,
            },
        });
    },
);

export const updateTaskController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const projectId = getProjectIdParam(req);
        const taskId = getTaskIdParam(req);

        const task = await updateTask(userId, projectId, taskId, req.body);

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: {
                task,
            },
        });
    },
);

export const deleteTaskController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const projectId = getProjectIdParam(req);
        const taskId = getTaskIdParam(req);

        await deleteTask(userId, projectId, taskId);

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    },
);
