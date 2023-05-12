import { Request, Response } from 'express'

export const notFoundHandler = (req: Request, res: Response) => {
  return res.formatter.notFound('not found')
}
