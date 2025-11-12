import {Controller, Post, Body, Get, Query, Delete, Param, Patch} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {PrismaService} from '@framework/prisma/prisma.service';
import {Prisma} from '@prisma/client';
import {
  CreateMessageBotChannelRequestDto,
  ListMessageBotChannelsRequestDto,
  ListMessageBotChannelsResponseDto,
  UpdateMessageBotChannelRequestDto,
} from '../message-bot.dto';
import {MessageBotPlatform} from '../message-bot.constants';

@ApiTags('Message Bot / Lark Channel')
@ApiBearerAuth()
@Controller('lark-channels')
export class LarkChannelController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('')
  @ApiResponse({type: ListMessageBotChannelsResponseDto})
  async listChannels(@Query() query: ListMessageBotChannelsRequestDto) {
    const {page, pageSize} = query;
    return this.prisma.findManyInManyPages({
      model: Prisma.ModelName.MessageBotChannel,
      pagination: {page, pageSize},
      findManyArgs: {
        where: {deletedAt: null, platform: MessageBotPlatform.Lark},
      },
    });
  }

  @Post('')
  async createChannel(@Body() body: CreateMessageBotChannelRequestDto) {
    return await this.prisma.messageBotChannel.create({
      data: {...body, platform: MessageBotPlatform.Lark},
    });
  }

  @Patch(':id')
  async updateChannel(@Param('id') id: string, @Body() body: UpdateMessageBotChannelRequestDto) {
    return await this.prisma.messageBotChannel.update({
      where: {id},
      data: body,
    });
  }

  @Delete(':id')
  async deleteChannel(@Param('id') id: string) {
    return await this.prisma.messageBotChannel.update({
      where: {id},
      data: {deletedAt: new Date()},
    });
  }
}
