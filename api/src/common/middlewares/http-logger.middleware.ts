// src/common/middleware/http-logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const responseTime = Date.now() - (request['startTime'] as number);

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${responseTime}ms - ${contentLength} bytes - ${userAgent}`,
      );
    });

    request['startTime'] = Date.now();
    next();
  }
}