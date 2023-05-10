import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import AppError from '../utils/appError'

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET! as string, (err, user) => {
      if (err) {
        throw new AppError('Forbidden', 403)
        return
      }

      req.user = user
      next()
      return
    })
  } else {
    throw new AppError('Unauthorized', 401)
    return
  }
}
