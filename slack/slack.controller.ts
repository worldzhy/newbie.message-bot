import {Controller, Post, Body, Get, Query} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {PrismaService} from '@framework/prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {SlackMessageBotService} from '@microservices/message-bot/slack/slack.service';
import {CommonCUDResDto} from '@framework/common.dto';
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
  SlackMessageBotSendMessageReqDto,
  SlackMessageBotSendMessageResDto,
  SlackMessageBotSendTextMessageReqDto,
} from './slack.dto';

@ApiTags('Message Bot')
@ApiBearerAuth()
@Controller('message-bot/slack')
export class SlackMessageBotController {
  constructor(
    private slackMessageBotService: SlackMessageBotService,
    private readonly prisma: PrismaService
  ) {}

  @Post('channels/create')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async channelCreate(
    @Body()
    body: MessageBotCreateChannelReqDto
  ) {
    return await this.slackMessageBotService.createChannel(body);
  }

  @Post('channels/update')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async channelUpdate(
    @Body()
    body: MessageBotUpdateChannelReqDto
  ) {
    return await this.slackMessageBotService.updateChannel(body);
  }

  @Post('channels/delete')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async channelDelete(
    @Body()
    body: MessageBotUpdateChannelReqDto
  ) {
    return await this.slackMessageBotService.deleteChannel(body);
  }

  @Get('channels/list')
  @ApiResponse({
    type: MessageBotListChannelsResDto,
  })
  async channelList(@Query() query: MessageBotListChannelsReqDto) {
    const {page, pageSize} = query;
    return this.prisma.findManyInManyPages({
      model: Prisma.ModelName.MessageBotChannel,
      pagination: {page, pageSize},
      findManyArgs: {
        where: {deletedAt: null, platform: MessageBotPlatform.Slack},
      },
    });
  }

  @Get('messages/list')
  @ApiResponse({
    type: MessageBotListMessagesResDto,
  })
  async recordList(@Query() query: MessageBotListMessagesReqDto) {
    const {page, pageSize, channelId} = query;
    return this.prisma.findManyInManyPages({
      model: Prisma.ModelName.MessageBotRecord,
      pagination: {page, pageSize},
      findManyArgs: {
        where: {
          channelId,
        },
        orderBy: {id: 'desc'},
      },
    });
  }

  @Post('messages/send')
  @ApiResponse({
    type: SlackMessageBotSendMessageResDto,
  })
  async send(@Body() body: SlackMessageBotSendMessageReqDto) {
    return await this.slackMessageBotService.sendMessage(body);
  }

  @Post('messages/send-text')
  @ApiResponse({
    type: SlackMessageBotSendMessageResDto,
  })
  async sendText(@Body() body: SlackMessageBotSendTextMessageReqDto) {
    return await this.slackMessageBotService.sendText(body);
  }
}
