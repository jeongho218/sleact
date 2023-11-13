import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UserDto } from '../common/dto/user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';

@UseInterceptors(UndefinedToNullInterceptor) // 인터셉트를 전체적으로 적용하고 싶다면 이 곳에,
// 특정 라우터에만 적용하고 싶다면 그 곳에 입력
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    type: UserDto,
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async join(@Body() data: JoinRequestDto) {
    // DTO(Data transfer Object) express의 body parser와 같은 역할
    await this.usersService.join(data.email, data.nickname, data.password);
  }

  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@User() user) {
    return user;
  }

  @ApiResponse({
    type: UserDto,
  })
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut(); // passport 적용 예정
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
