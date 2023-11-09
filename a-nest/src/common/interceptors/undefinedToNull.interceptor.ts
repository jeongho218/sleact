import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 컨트롤러로 돌아가기 전 수행할 동작
    // 컨트롤러가 실행되고 난 후 수행할 동작은 next.handle() 다음에 작성
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
  }
}

/**json에서 null은 취급하나
 * undefined는 취급하지 않아 에러가 발생할 수 있다.
 * 이를 방지하기 위해서 만약 값이 undefined일 경우
 * 값을 null로 바꿔주는 기능을 하는 인터셉터이다.
 */

// interceptor 인터셉터
// 컨트롤러 다음에 어떤 동작을 할때 사용
// 양쪽에 컨트롤러 시작 전과 시작 후 둘 다를 조작할때 사용

// 미들웨어와 비슷하지만..
// 익스프레스에서 사용하던 미들웨어는 예를 들어 res.json으로 보낸 데이터를 다시 한 번 더 조작하고 싶은 상황이 와도 구현해내기가 복잡하다.

// 인터셉터는 내가 어떠한 응답을 보냈을때 그 응답을 마지막으로 한 번 더 조작을 할 수 있게 된다..
// 다시 말해 컨트롤러에서 리턴한 데이터를 마지막으로 한 번 더 가공할 수 있다..

// implements
// 타입등을 정확하게 지켜서 구현할 수 있도록 도와주는 역할
// 임플리먼츠가 있다면 인터셉터 내용에 intercept만 입력하고 자동 완성으로 만들 수 있음
