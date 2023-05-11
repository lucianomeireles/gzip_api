import { Request, Response, NextFunction } from "express";
import AppError, { ErrorResponse } from "../utils/appError";
import logger from "../config/winston.config";

export const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(err.message, err);

  return res.formatter.badRequest(message);
};
