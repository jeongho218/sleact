import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { ChannelsService } from './channels.service';
import { PostChatDto } from './post-chat.dto';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get()
  getAllChannels(@Param('url') url: string, @User() user) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @Post()
  postChannels() {
    //
  }

  @Get(':name')
  getSpecificChannel(@Param('name') name: string) {
    //
  }

  @Get(':name/chats')
  getChats(
    @Query('url') url: string,
    @Param('name') name: string,
    @Query() query,
    @Param() param,
  ) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
    return this.channelsService.getWorkspaceChannelChats(
      url,
      name,
      query.perPage,
      query.page,
    );
  }

  @Post(':name/chats')
  postChat(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body() body: PostChatDto,
    @User() user,
  ) {
    // web socket 사용
    return this.channelsService.postChat({
      url,
      content: body.content,
      name,
      myId: user.id,
    });
  }

  @Post(':name/images')
  postImages(@Body() body) {
    // multer가 쓰일 예정
    // return this.channelsService.
  }

  @Get(':name/unreads')
  PostChat(
    @Param('url') url: string,
    @Param('name') name: string,
    @Query('after') after: number,
  ) {
    return this.channelsService.getChannelUnreadsCount(url, name, after);
  }

  @Get(':name/members')
  getAllMembers(@Param('url') url: string, @Param('name') name: string) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @Post(':name/members')
  inviteMembers() {
    //
  }
}
