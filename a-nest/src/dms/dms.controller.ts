import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
@Controller('api/workspaces/:url/dms')
export class DmsController {
  @ApiParam({ name: 'url', required: true, description: '워크스페이스 URL' })
  @ApiParam({ name: 'id', required: true, description: '사용자 ID' })
  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한 번에 개져오는 개수',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: '불러올 페이지',
  })
  @Get(':id/chats')
  getChat(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }
  //   위처럼 쓸 수도 있고, 아래처럼 쓸 수도 있음, 이건 자유
  //   getChat(
  //     @Query('perPage') perPage,
  //     @Query('page') page,
  //     @Param('id') id,
  //     @Param('url') url,
  //   ) {
  //     console.log(perPage, page);
  //     console.log(id, url);
  //   }
  // nest는 interface 기반이기 때문에 웬만해서는 interface의 설정 방식과 유사함

  @Post(':id/chats')
  postChat(@Body() body) {
    //
  }
}
