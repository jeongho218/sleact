import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspaces/:url/dms')
export class DmsController {
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
