import {Controller, Post, Body, Get, Query} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {PrismaService} from '@framework/prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {LarkMessageBotService} from './lark.service';
import {ListMessageBotMessagesRequestDto, ListMessageBotMessagesResponseDto} from '../message-bot.dto';
import {
  LarkMessageBotSendMessageReqDto,
  LarkMessageBotSendMessageResDto,
  LarkMessageBotSendTextMessageReqDto,
} from './lark.dto';

@ApiTags('Message Bot / Lark Message')
@ApiBearerAuth()
@Controller('lark-messages')
export class LarkMessageController {
  constructor(
    private larkMessageBotService: LarkMessageBotService,
    private readonly prisma: PrismaService
  ) {}

  @Get('')
  @ApiResponse({type: ListMessageBotMessagesResponseDto})
  async listMessages(@Query() query: ListMessageBotMessagesRequestDto) {
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
    type: LarkMessageBotSendMessageResDto,
  })
  async sendMessage(@Body() body: LarkMessageBotSendMessageReqDto) {
    return await this.larkMessageBotService.sendMessage(body);
  }

  @Post('send-text')
  @ApiResponse({
    type: LarkMessageBotSendMessageResDto,
  })
  async sendTextMessage(@Body() body: LarkMessageBotSendTextMessageReqDto) {
    return await this.larkMessageBotService.sendText(body);
  }
}
