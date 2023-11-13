import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  // dependency injection할 때에는
  // 실체 객체를 우선 모듈에 넣어주어야 한다.
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
