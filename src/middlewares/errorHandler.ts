import { Request, Response, NextFunction } from 'express'
import { ErrorResponse } from '../utils/appError'
import logger from '../config/winston.config'

export const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    if (statusCode >= 500) logger.error(err.message, err)

    return res.formatter.badRequest({
      message: message,
    })
  }
  next()
}
