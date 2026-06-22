import { Types } from "mongoose";
import { AppError } from "../utils/AppError";
import { signToken } from "../utils/jwt";
import { IUser, User } from "../models/user.model";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

function getUserId(user: IUser): string {
    return (user._id as Types.ObjectId).toString();
}

function sanitizeUser(user: IUser) {
    return {
        id: getUserId(user),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

export async function registerUser(input: RegisterInput) {
    const existingUser = await User.findOne({ email: input.email });

    if (existingUser) {
        throw new AppError("Email is already registered", 409);
    }

    const user = await User.create({
        name: input.name,
        email: input.email,
        password: input.password,
    });

    const token = signToken({
        userId: getUserId(user),
        role: user.role,
    });

    return {
        user: sanitizeUser(user),
        token,
    };
}

export async function loginUser(input: LoginInput) {
    const user = await User.findOne({ email: input.email }).select("+password");

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordCorrect = await user.comparePassword(input.password);

    if (!isPasswordCorrect) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = signToken({
        userId: getUserId(user),
        role: user.role,
    });

    return {
        user: sanitizeUser(user),
        token,
    };
}

export async function getCurrentUser(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return sanitizeUser(user);
}
