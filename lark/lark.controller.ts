import {Controller, Post, Body, Get, Query} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {PrismaService} from '@framework/prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {CommonCUDResDto} from '@framework/common.dto';
import {LarkMessageBotService} from './lark.service';
import {
  MessageBotCreateChannelReqDto,
  MessageBotUpdateChannelReqDto,
  MessageBotListChannelsReqDto,
  MessageBotListChannelsResDto,
  MessageBotListMessagesReqDto,
  MessageBotListMessagesResDto,
} from '../message-bot.dto';
import {MessageBotPlatform} from '../message-bot.constants';
import {
  LarkMessageBotSendMessageReqDto,
  LarkMessageBotSendMessageResDto,
  LarkMessageBotSendTextMessageReqDto,
} from './lark.dto';

@ApiTags('Message Bot')
@ApiBearerAuth()
@Controller('message-bot/lark')
export class LarkMessageBotController {
  constructor(
    private larkMessageBotService: LarkMessageBotService,
    private readonly prisma: PrismaService
  ) {}

  @Post('channels/create')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async createChannel(
    @Body()
    body: MessageBotCreateChannelReqDto
  ) {
    return await this.larkMessageBotService.createChannel(body);
  }

  @Post('channels/update')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async updateChannel(
    @Body()
    body: MessageBotUpdateChannelReqDto
  ) {
    return await this.larkMessageBotService.updateChannel(body);
  }

  @Post('channels/delete')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async deleteChannel(
    @Body()
    body: MessageBotUpdateChannelReqDto
  ) {
    return await this.larkMessageBotService.deleteChannel(body);
  }

  @Get('channels/list')
  @ApiResponse({
    type: MessageBotListChannelsResDto,
  })
  async listChannels(@Query() query: MessageBotListChannelsReqDto) {
    const {page, pageSize} = query;
    return this.prisma.findManyInManyPages({
      model: Prisma.ModelName.MessageBotChannel,
      pagination: {page, pageSize},
      findManyArgs: {
        where: {deletedAt: null, platform: MessageBotPlatform.Lark},
      },
    });
  }

  @Get('messages/list')
  @ApiResponse({
    type: MessageBotListMessagesResDto,
  })
  async listMessages(@Query() query: MessageBotListMessagesReqDto) {
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

  @Post('messages/send')
  @ApiResponse({
    type: LarkMessageBotSendMessageResDto,
  })
  async sendMessage(@Body() body: LarkMessageBotSendMessageReqDto) {
    return await this.larkMessageBotService.sendMessage(body);
  }

  @Post('messages/send-text')
  @ApiResponse({
    type: LarkMessageBotSendMessageResDto,
  })
  async sendTextMessage(@Body() body: LarkMessageBotSendTextMessageReqDto) {
    return await this.larkMessageBotService.sendText(body);
  }
}
