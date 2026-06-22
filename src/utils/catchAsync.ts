import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<unknown>;

export function catchAsync(fn: AsyncController): RequestHandler {
    return (req, res, next): void => {
        void fn(req, res, next).catch(next);
    };
}
