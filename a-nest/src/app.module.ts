import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelChats } from './entities/ChannelChats';
import { ChannelMembers } from './entities/ChannelMembers';
import { Channels } from './entities/Channels';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';
import { Users } from './entities/Users';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { Workspaces } from './entities/Workspaces';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        ChannelChats,
        ChannelMembers,
        Channels,
        DMs,
        Mentions,
        Users,
        WorkspaceMembers,
        Workspaces,
      ],
      // autoLoadEntities:true, // 이 옵션은 버그가 발생하는 경우가 잦으므로 주의
      // 하단 `TypeOrmModule.forFeature([Users])`이 가동될때 entities 폴더의 내용을 읽어 가져오는 방식
      keepConnectionAlive: true, // 배포 후 의도적으로 서버를 종료하는 경우가 아니라면 계속해서 true 상태로 둘 것
      // 이 옵션이 없거나 false이면 기존에 설정해둔 hot reloading으로 인해서
      // 파일 내용 수정 후 저장할때마다(서버가 재시작될때마다)
      // TypeORM과 DB 연결이 끊어졌다는 에러 메세지가 출력됨
      synchronize: false, // 개발 환경일때만 true인 옵션
      // 엔티티를 직접 작성하고, 이 내용을 DB로 옮길때 필요함
      // DB에 테이블(엔티티) 생성 작업이 완료되었다면 false로 돌릴 것
      // 매번 싱크하면 저장된 데이터가 상실될 위험성이 있음
      logging: true,
      charset: 'utf8mb4_general_ci', // 이모티콘을 사용하기 위한 캐릭터셋
    }),
    TypeOrmModule.forFeature([Users]),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
