import { NextFunction, Request, RequestHandler, Response } from 'express'

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

const catchAsync = (handler: AsyncHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    return handler(req, res, next).catch(next)
  }
}

export default catchAsync
