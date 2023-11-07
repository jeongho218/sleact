import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'example@email.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  @ApiProperty({ example: 'nickname', description: '닉네임', required: true })
  public nickname: string;

  @ApiProperty({
    example: 'password123!@#',
    description: '패스워드',
    required: true,
  })
  public password: string;
}
