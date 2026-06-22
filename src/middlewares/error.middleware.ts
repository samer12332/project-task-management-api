import { ErrorRequestHandler } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal server error";

    if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    if (error.code === 11000) {
        statusCode = 409;
        message = "Duplicate field value";
    }

    if (!(error instanceof AppError)) {
        console.error(error);
    }

    res.status(statusCode).json({
        success: false,
        status: statusCode >= 500 ? "error" : "fail",
        message,
        ...(env.nodeEnv === "development" && { stack: error.stack }),
    });
};
