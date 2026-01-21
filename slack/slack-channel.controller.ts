import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiResponse, ApiTags} from '@nestjs/swagger';
import {PrismaService} from '@framework/prisma/prisma.service';
import {Prisma} from '@generated/prisma/client';
import {
  CreateMessageBotChannelRequestDto,
  ListMessageBotChannelsRequestDto,
  ListMessageBotChannelsResponseDto,
  UpdateMessageBotChannelRequestDto,
} from '../message-bot.dto';
import {MessageBotPlatform} from '../message-bot.constants';

@ApiTags('Message Bot / Slack Channel')
@ApiBearerAuth()
@Controller('slack-channels')
export class SlackChannelController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('')
  async channelCreate(@Body() body: CreateMessageBotChannelRequestDto) {
    return await this.prisma.messageBotChannel.create({
      data: {...body, platform: MessageBotPlatform.Slack},
    });
  }

  @Patch(':id')
  async channelUpdate(@Param('id') id: string, @Body() body: UpdateMessageBotChannelRequestDto) {
    return await this.prisma.messageBotChannel.update({
      where: {id},
      data: body,
    });
  }

  @Delete(':id')
  async channelDelete(@Param('id') id: string) {
    return await this.prisma.messageBotChannel.update({
      where: {id},
      data: {deletedAt: new Date()},
    });
  }

  @Get('')
  @ApiResponse({type: ListMessageBotChannelsResponseDto})
  async channelList(@Query() query: ListMessageBotChannelsRequestDto) {
    const {page, pageSize, groupId} = query;
    return this.prisma.findManyInManyPages({
      model: Prisma.ModelName.MessageBotChannel,
      pagination: {page, pageSize},
      findManyArgs: {
        where: {deletedAt: null, platform: MessageBotPlatform.Slack, groupId},
      },
    });
  }
}
