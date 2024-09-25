import {Controller, Post, Body, Get, Query} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {PrismaService} from '@framework/prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {CommonCUDResDto} from '@framework/common.dto';
import {LarkMessageBotService} from './lark.service';
import {
  MessageBotChannelCreateReqDto,
  MessageBotChannelUpdateReqDto,
  MessageBotChannelListReqDto,
  MessageBotChannelListResDto,
  MessageBotRecordListReqDto,
  MessageBotRecordListResDto,
} from '../message-bot.dto';
import {MessageBotPlatform} from '../message-bot.constants';
import {LarkMessageBotReqDto, LarkMessageBotResDto} from './lark.dto';

@ApiTags('Message Bot')
@ApiBearerAuth()
@Controller('message-bot/lark')
export class LarkMessageBotController {
  constructor(
    private larkMessageBotService: LarkMessageBotService,
    private readonly prisma: PrismaService
  ) {}

  @Post('channel/create')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async createChannel(
    @Body()
    body: MessageBotChannelCreateReqDto
  ) {
    return await this.larkMessageBotService.createChannel(body);
  }

  @Post('channel/update')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async updateChannel(
    @Body()
    body: MessageBotChannelUpdateReqDto
  ) {
    return await this.larkMessageBotService.updateChannel(body);
  }

  @Post('channel/delete')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async deleteChannel(
    @Body()
    body: MessageBotChannelUpdateReqDto
  ) {
    return await this.larkMessageBotService.deleteChannel(body);
  }

  @Get('channel/list')
  @ApiResponse({
    type: MessageBotChannelListResDto,
  })
  async listChannels(@Query() query: MessageBotChannelListReqDto) {
    const {page, pageSize} = query;
    return this.prisma.findManyInManyPages({
      model: Prisma.ModelName.MessageBotChannel,
      pagination: {page, pageSize},
      findManyArgs: {where: {deletedAt: null, platform: MessageBotPlatform.Lark}},
    });
  }

  @Get('record/list')
  @ApiResponse({
    type: MessageBotRecordListResDto,
  })
  async listRecord(@Query() query: MessageBotRecordListReqDto) {
    const {page, pageSize, channelId} = query;
    return this.prisma.findManyInManyPages({
      model: Prisma.ModelName.MessageBotRecord,
      pagination: {page, pageSize},
      findManyArgs: {
        where: {channelId},
        orderBy: {id: 'desc'},
      },
    });
  }

  @Post('send')
  @ApiResponse({
    type: LarkMessageBotResDto,
  })
  async send(@Body() body: LarkMessageBotReqDto) {
    return await this.larkMessageBotService.send(body);
  }
}
