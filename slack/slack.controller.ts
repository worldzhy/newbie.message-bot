import {Controller, Post, Body, Get, Query} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {PrismaService} from '@toolkit/prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {SlackMessageBotService} from '@microservices/message-bot/slack/slack.service';
import {CommonCUDResDto} from '@framework/common.dto';
import {
  MessageBotChannelCreateReqDto,
  MessageBotChannelUpdateReqDto,
  MessageBotChannelListReqDto,
  MessageBotChannelListResDto,
  MessageBotRecordListReqDto,
  MessageBotRecordListResDto,
} from '../message-bot.dto';
import {SlackMessageBotReqDto, SlackMessageBotResDto} from './slack.dto';

@ApiTags('Message Bot')
@ApiBearerAuth()
@Controller('message-bot/slack')
export class SlackMessageBotController {
  constructor(
    private slackMessageBotService: SlackMessageBotService,
    private readonly prisma: PrismaService
  ) {}

  @Post('channel/create')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async channelCreate(
    @Body()
    body: MessageBotChannelCreateReqDto
  ) {
    return await this.slackMessageBotService.createChannel(body);
  }

  @Post('channel/update')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async channelUpdate(
    @Body()
    body: MessageBotChannelUpdateReqDto
  ) {
    return await this.slackMessageBotService.updateChannel(body);
  }

  @Post('channel/delete')
  @ApiResponse({
    type: CommonCUDResDto,
  })
  async channelDelete(
    @Body()
    body: MessageBotChannelUpdateReqDto
  ) {
    return await this.slackMessageBotService.deleteChannel(body);
  }

  @Get('channel/list')
  @ApiResponse({
    type: MessageBotChannelListResDto,
  })
  async channelList(@Query() query: MessageBotChannelListReqDto) {
    const {page, pageSize, accessKeyId, platform} = query;
    return this.prisma.findManyInManyPages({
      model: Prisma.ModelName.MessageBotChannel,
      pagination: {page, pageSize},
      findManyArgs: {
        where: {
          deletedAt: null,
          accessKeyId,
          platform,
        },
      },
    });
  }

  @Get('record/list')
  @ApiResponse({
    type: MessageBotRecordListResDto,
  })
  async recordList(@Query() query: MessageBotRecordListReqDto) {
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

  @Post('record/send')
  @ApiResponse({
    type: SlackMessageBotResDto,
  })
  async slackWebhook(body: SlackMessageBotReqDto) {
    return await this.slackMessageBotService.send(body);
  }
}
