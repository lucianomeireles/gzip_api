import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const catchAsync = (handler: AsyncHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return handler(req, res, next).catch(next);
  };
};

export default catchAsync;
