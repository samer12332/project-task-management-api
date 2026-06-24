import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import {
    getCurrentUser,
    loginUser,
    registerUser,
} from "../services/auth.service";
import { AppError } from "../utils/AppError";

export const register: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
    const result = await registerUser(req.body);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
    });
    },
);

export const login: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
    const result = await loginUser(req.body);

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result,
    });
    },
);

export const getMe: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError("Authentication required", 401);
    }

    const user = await getCurrentUser(req.user.id);

    res.status(200).json({
        success: true,
        data: {
            user,
        },
    });
    },
);
