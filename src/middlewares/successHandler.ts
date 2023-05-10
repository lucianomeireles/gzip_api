import { Request, Response, NextFunction } from 'express'

export const successHandler = (req: Request, res: Response, next: NextFunction) => {
  // if (!res.headersSent) {
  //   // Set default success status code if it hasn't been set already
  //   if (!res.statusCode || res.statusCode === 200) {
  //     res.status(204);
  //   }
  //   res.json({
  //     success: "success",
  //     data: res.locals.data,
  //   });
  // }
  res.json({
    success: 'success',
    data: res.locals.data,
  })
  next()
}
