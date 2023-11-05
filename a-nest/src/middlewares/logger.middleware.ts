import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
    next();
  }
}

// 이 파일의 진행 순서
// 1. request로 들어온 ip, method, originalUrl, userAgent 선언
// 2. next(), 미들웨어 다음 작업 순서인 라우터 진행
// 3. 다시 돌아와 response.on...this.logger.log 로그 찍기 진행

// express에서 쓰던 모건(morgan)은 라우터 내용이 끝나고 난 후 로깅을 시작하나
// 미들웨어는 라우터보다 먼저 실행된다.
// 리퀘스트에 대한 내용(ip, method, originalUrl.. 등)을 기록하고,
// 이후 라우터 작업이 끝나면('finish') 로그를 찍기 때문에
// 비동기('on')을 표시해주어야 한다.

// 이는 미들웨어 실습용 예시 파일이니 실제 작업에서는 그냥 네스트 모건 쓰도록 하자..
