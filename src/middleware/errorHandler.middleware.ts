import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
  });
};