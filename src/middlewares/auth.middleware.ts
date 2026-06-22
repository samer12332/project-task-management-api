import { RequestHandler } from "express";
import { Types } from "mongoose";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

export const protect: RequestHandler = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith("Bearer ")
        ) {
            return next(new AppError("Authentication token is required", 401));
        }

        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            return next(new AppError("Authentication token is required", 401));
        }

        const decoded = verifyToken(token);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return next(new AppError("User no longer exists", 401));
        }

        req.user = {
            id: (user._id as Types.ObjectId).toString(),
            role: user.role,
        };

        next();
    } catch (error) {
        next(new AppError("Invalid or expired token", 401));
    }
};
