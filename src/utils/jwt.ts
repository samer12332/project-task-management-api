import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../models/user.model";

export interface JwtPayload {
    userId: string;
    role: UserRole;
}

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

export function signToken(payload: JwtPayload): string {
    const options: SignOptions = {
        expiresIn: env.jwtExpiresIn as JwtExpiresIn,
    };

    return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
