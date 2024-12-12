import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // If it's an HttpException, we can extract status and response message
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse && typeof exceptionResponse === 'object') {
        const { error, message: msg } = exceptionResponse as Record<
          string,
          any
        >;
        message = msg || error || message;
      }
    } else if (exception.message) {
      // If it’s not an HttpException, try to use the message property if available
      message = exception.message;
    }

    // Log the error
    this.logger.error(`Status: ${status} Error: ${message}`, exception.stack);

    // Send the error response
    response.status(status).json({ error: message });
  }
}
