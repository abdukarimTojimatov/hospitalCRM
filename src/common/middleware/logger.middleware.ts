import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const body = req.body;
    const query = req.query;
    const params = req.params;
    const headers = req.headers;

    this.logger.log(
      `
      ''''''''''''''''''''''''''''''''''''''''''''''''
      ' Incoming Request==> ${method} ${originalUrl}   '
      ''''''''''''''''''''''''''''''''''''''''''''''''

      `,
      // `Params: ${JSON.stringify(params)}\n` +
      // `Query: ${JSON.stringify(query)}\n` +
      // `Body: ${JSON.stringify(body)}\n` +
      // `Headers: ${JSON.stringify(headers)}`,
    );

    next();
  }
}
