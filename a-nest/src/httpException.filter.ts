import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: any; statusCode: number }
      | { error: string; statusCode: 400; message: string[] }; // class-validator

    if (typeof err !== 'string' && err.statusCode === 400) {
      // class-validator에서 발생한 에러
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message,
      });
    }

    // 테스트를 위해 직접 발생시킨 에러
    response.status(status).json({
      success: false,
      code: status,
      data: err.message,
    });
  }
}
