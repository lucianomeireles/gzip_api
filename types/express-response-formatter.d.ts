declare module 'express-response-formatter' {
    export interface IResponseOptions {
      status?: number;
      message?: string;
      data?: any;
    }
  
    export type ResponseFormatter = (options: IResponseOptions) => object;
  
    export function responseFormatter(formatter: ResponseFormatter): (req: any, res: any, next: any) => void;
  }
  