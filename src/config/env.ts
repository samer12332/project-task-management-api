import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "development" | "production" | "test";

interface EnvConfig {
    port: number;
    nodeEnv: NodeEnv;
    mongoUri: string;
    jwtSecret: string;
    jwtExpiresIn: string;
}

function getRequiredEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
}

export const env: EnvConfig = {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: (process.env.NODE_ENV as NodeEnv) || "development",
    mongoUri: getRequiredEnv("MONGO_URI"),
    jwtSecret: getRequiredEnv("JWT_SECRET"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
