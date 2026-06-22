import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);
