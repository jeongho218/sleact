import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UserDto } from '../common/dto/user.dto';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { NotLoggedInGuard } from '../auth/not-logged-in-guard';
import { Users } from '../entities/Users';

@UseInterceptors(UndefinedToNullInterceptor) // 인터셉트를 전체적으로 적용하고 싶다면 이 곳에,
// 특정 라우터에만 적용하고 싶다면 그 곳에 입력
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    type: UserDto,
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  async getUsers(@User() user: Users) {
    return user || false;
  }

  @UseGuards(new NotLoggedInGuard())
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async join(@Body() data: JoinRequestDto) {
    // DTO(Data transfer Object) express의 body parser와 같은 역할
    const result = await this.usersService.join(
      data.email,
      data.nickname,
      data.password,
    );

    if (result) {
      return 'ok';
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiCookieAuth('connect.sid')
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '로그인' })
  @UseGuards(new LocalAuthGuard())
  @Post('login')
  async login(@User() user: Users) {
    return user;
  }

  @ApiCookieAuth('connect.sid')
  @UseGuards(new LoggedInGuard())
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  async logOut(@Req() req, @Res() res) {
    req.logOut(); // passport 적용 예정
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
