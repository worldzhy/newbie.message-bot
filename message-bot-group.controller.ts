import {Controller, Post, Body, Get, Query, Patch, Delete, Param} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {Prisma} from '@generated/prisma/client';
import {PrismaService} from '@framework/prisma/prisma.service';
import {CommonGetByStringIdRequestDto} from '@framework/common.dto';
import {
  CreateMessageBotChannelGroupRequestDto,
  UpdateMessageBotChannelGroupRequestDto,
  ListMessageBotChannelGroupsRequestDto,
  ListMessageBotChannelGroupsResponseDto,
} from './message-bot-group.dto';
import {MessageBotChannelGroupEntity} from './message-bot.entity';

@ApiTags('MessageBot')
@ApiBearerAuth()
@Controller('message-bot-groups')
export class MessageBotChannelGroupController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiResponse({type: ListMessageBotChannelGroupsResponseDto})
  async list(@Query() query: ListMessageBotChannelGroupsRequestDto) {
    const {page, pageSize, id} = query;
    return this.prisma.findManyInManyPages({
      model: Prisma.ModelName.MessageBotChannelGroup,
      pagination: {page, pageSize},
      findManyArgs: {where: {deletedAt: null, id}, orderBy: {sort: 'desc'}},
    });
  }

  @Post()
  @ApiResponse({type: MessageBotChannelGroupEntity})
  async create(@Body() body: CreateMessageBotChannelGroupRequestDto) {
    return await this.prisma.messageBotChannelGroup.create({data: body});
  }

  @Patch(':id')
  @ApiResponse({type: MessageBotChannelGroupEntity})
  async update(@Param() params: CommonGetByStringIdRequestDto, @Body() body: UpdateMessageBotChannelGroupRequestDto) {
    return await this.prisma.messageBotChannelGroup.update({where: {id: params.id}, data: body});
  }

  @Delete(':id')
  @ApiResponse({type: MessageBotChannelGroupEntity})
  async delete(@Param() params: CommonGetByStringIdRequestDto) {
    return await this.prisma.messageBotChannelGroup.delete({where: {id: params.id}});
  }
}
