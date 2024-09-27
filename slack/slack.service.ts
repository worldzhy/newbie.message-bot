import {HttpService} from '@nestjs/axios';
import {AxiosResponse, AxiosError} from 'axios';
import {Injectable, BadRequestException} from '@nestjs/common';
import {PrismaService} from '@framework/prisma/prisma.service';
import {
  SlackMessageBotReqDto,
  SlackMessageBotResDto,
  SlackWebhookPostResDto,
  SlackWebhookPostBodyDto,
} from './slack.dto';
import {
  MessageBotChannelCreateReqDto,
  MessageBotChannelUpdateReqDto,
} from '../message-bot.dto';
import {
  MessageBotPlatform,
  MessageBotRecordStatus,
} from '../message-bot.constants';

@Injectable()
export class SlackMessageBotService {
  constructor(
    private httpService: HttpService,
    private readonly prisma: PrismaService
  ) {}

  async createChannel(
    body: MessageBotChannelCreateReqDto
  ): Promise<{id: number}> {
    const {name} = body;
    const channel = await this.prisma.messageBotChannel.findFirst({
      where: {name, platform: MessageBotPlatform.Slack},
    });
    if (channel) {
      throw new BadRequestException('Channel name already exists');
    }

    return await this.prisma.messageBotChannel.create({
      data: {...body, platform: MessageBotPlatform.Slack},
    });
  }

  async updateChannel(
    body: MessageBotChannelUpdateReqDto
  ): Promise<{id: number}> {
    const {id} = body;
    return await this.prisma.messageBotChannel.update({
      where: {id},
      data: {...body},
    });
  }

  async deleteChannel(
    body: MessageBotChannelUpdateReqDto
  ): Promise<{id: number}> {
    const {id} = body;

    return await this.prisma.messageBotChannel.update({
      where: {id},
      data: {deletedAt: new Date()},
    });
  }

  async send(req: SlackMessageBotReqDto): Promise<SlackMessageBotResDto> {
    const {channelName, body} = req;
    const channel = await this.prisma.messageBotChannel.findUniqueOrThrow({
      where: {
        name_platform: {
          name: channelName,
          platform: MessageBotPlatform.Slack,
        },
      },
    });

    const newRecord = await this.prisma.messageBotRecord.create({
      data: {
        channelId: channel.id,
        status: MessageBotRecordStatus.Pending,
        request: body as object,
      },
    });

    const result: SlackMessageBotResDto = await this.httpService.axiosRef
      .post<SlackWebhookPostBodyDto, AxiosResponse<SlackWebhookPostResDto>>(
        channel.webhook,
        body
      )
      .then(res => {
        return {res: res.data};
      })
      .catch((e: AxiosError) => {
        return {error: {message: e.response?.data}};
      });

    await this.prisma.messageBotRecord.update({
      where: {id: newRecord.id},
      data: {
        response: result as object,
        status: result.error
          ? MessageBotRecordStatus.Failed
          : MessageBotRecordStatus.Succeeded,
      },
    });

    return result;
  }
}
