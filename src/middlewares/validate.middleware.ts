import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError";

export const validateRequest: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const message = errors
            .array()
            .map((error) => error.msg)
            .join(", ");

        return next(new AppError(message, 400));
    }

    next();
};
