import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(request: Request, response: Response, next: NextFunction) {
    const { method, url, body, headers } = request;
    const logMessage = {
      method,
      url,
      body,
      headers,
    };
    response.on('finish', () => {
      this.logger.info(JSON.stringify(logMessage));
    });

    next();
  }
}
