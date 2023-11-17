import { Module } from '@nestjs/common';
import { DMsService } from './dms.service';
import { DMsController } from './dms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMs } from '../entities/DMs';
import { Users } from '../entities/Users';
import { Workspaces } from '../entities/Workspaces';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([DMs, Users, Workspaces]), EventsModule],
  controllers: [DMsController],
  providers: [DMsService],
})
export class DmsModule {}
