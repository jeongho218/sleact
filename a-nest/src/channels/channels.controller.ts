import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  @Get()
  getAllChannels() {
    //
  }

  @Post()
  postChannels() {
    //
  }

  @Get(':name')
  getSpecificChannel() {
    //
  }

  @Get(':name/chats')
  getChats(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':name/chats')
  postChat(@Body() body) {
    //
  }

  @Get(':name/members')
  getAllMembers() {
    //
  }

  @Post(':name/members')
  inviteMembers() {
    //
  }
}
