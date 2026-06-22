import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import {
    createProject,
    deleteProject,
    getProjectById,
    getProjects,
    updateProject,
} from "../services/project.service";
import { ProjectStatus } from "../models/project.model";

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

function getStringQueryValue(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
}

function getProjectListQuery(req: Request) {
    const query: {
        page?: string;
        limit?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        status?: ProjectStatus;
    } = {};

    const page = getStringQueryValue(req.query.page);
    const limit = getStringQueryValue(req.query.limit);
    const sortBy = getStringQueryValue(req.query.sortBy);
    const sortOrder = getStringQueryValue(req.query.sortOrder);
    const status = getStringQueryValue(req.query.status);

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

    if (
        status === "planning" ||
        status === "active" ||
        status === "completed" ||
        status === "archived"
    ) {
        query.status = status;
    }

    return query;
}

export const createProjectController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const project = await createProject(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: {
                project,
            },
        });
    },
);

export const getProjectsController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const query = getProjectListQuery(req);

        const result = await getProjects(userId, query);

        res.status(200).json({
            success: true,
            data: result,
        });
    },
);

export const getProjectByIdController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const projectId = getProjectIdParam(req);

        const project = await getProjectById(userId, projectId);

        res.status(200).json({
            success: true,
            data: {
                project,
            },
        });
    },
);

export const updateProjectController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const projectId = getProjectIdParam(req);

        const project = await updateProject(userId, projectId, req.body);

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: {
                project,
            },
        });
    },
);

export const deleteProjectController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const projectId = getProjectIdParam(req);

        await deleteProject(userId, projectId);

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    },
);
