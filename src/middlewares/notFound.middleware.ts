import { RequestHandler } from "express";
import { AppError } from "../utils/AppError";

export const notFoundMiddleware: RequestHandler = (req, res, next) => {
    next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};
