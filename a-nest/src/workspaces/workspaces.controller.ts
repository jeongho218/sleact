import {
  Controller,
  Delete,
  Get,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { User } from '../common/decorators/user.decorator';
import { Users } from 'src/entities/Users';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Get()
  getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @Post()
  createWorkspaces() {
    //
  }

  @Get(':url/members')
  getAllMembersFromWorkspace() {
    //
  }

  @Post(':url/members')
  inviteMembersToWorkspace() {
    //
  }

  @Delete(':url/members/:id')
  KickMemberFromWorkspace() {
    //
  }

  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {
    //
  }
}
