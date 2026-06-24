import { Request, RequestHandler, Response } from "express";
import {
    getAllProjects,
    getAllTasks,
    getAllUsers,
} from "../services/admin.service";
import { catchAsync } from "../utils/catchAsync";

function getStringQueryValue(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
}

function getAdminListQuery(req: Request) {
    const query: {
        page?: string;
        limit?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    } = {};

    const page = getStringQueryValue(req.query.page);
    const limit = getStringQueryValue(req.query.limit);
    const sortBy = getStringQueryValue(req.query.sortBy);
    const sortOrder = getStringQueryValue(req.query.sortOrder);

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

    return query;
}

export const getAllUsersController: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const result = await getAllUsers(getAdminListQuery(req));

        res.status(200).json({
            success: true,
            data: result,
        });
    },
);

export const getAllProjectsController: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const result = await getAllProjects(getAdminListQuery(req));

        res.status(200).json({
            success: true,
            data: result,
        });
    },
);

export const getAllTasksController: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const result = await getAllTasks(getAdminListQuery(req));

        res.status(200).json({
            success: true,
            data: result,
        });
    },
);
