import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  @Get()
  getMyWorkspaces() {
    //
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
