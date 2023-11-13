import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';

export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}

// pickType 공식 문서
// https://docs.nestjs.com/openapi/mapped-types#pick
// 픽타입을 이용해 DTO 내용을 Users 엔티티에서 가져오는 방식으로 변경함
// 하단의 내용은 기록용으로 남겨두나 없어도 동작함
// @ApiProperty({
//   example: 'example@email.com',
//   description: '이메일',
//   required: true,
// })
// public email: string;
// @ApiProperty({ example: 'nickname', description: '닉네임', required: true })
// public nickname: string;
// @ApiProperty({
//   example: 'password123!@#',
//   description: '패스워드',
//   required: true,
// })
// public password: string;
