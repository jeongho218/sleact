import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 커스텀 데코레이터
export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return response.local.jwt;
  },
);
