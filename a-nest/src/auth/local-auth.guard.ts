import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (can) {
      const request = context.switchToHttp().getRequest();
      console.log('login for cookie');
      await super.logIn(request);
    }
    return true;
  }
}

// super 현재 클래스의 상위 클래스(부모 클래스)에 정의된 메소드를 호출함
// 현재 클래스 LocalAuthGuard는 부모 클래스 AuthGuard에서 정의한 메소드
// canActivate(), logIn()을 사용함

// ('local')은 클래스 AuthGuard의 데코레이터를 의미함
// AuthGuard의 코드를 살펴보면 @local() 데코레이터가 있고
// 그 안에 .canActivate(), .logIn() 메소드에 대한 정의가 있을 것임
