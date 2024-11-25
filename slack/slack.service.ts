import {HttpService} from '@nestjs/axios';
import {AxiosError, AxiosResponse} from 'axios';
import {Injectable, BadRequestException} from '@nestjs/common';
import {PrismaService} from '@framework/prisma/prisma.service';
import {
  SlackMessageBotSendTextMessageReqDto,
  SlackMessageBotSendMessageReqDto,
  SlackMessageBotSendMessageResDto,
} from './slack.dto';
import {
  MessageBotCreateChannelReqDto,
  MessageBotUpdateChannelReqDto,
} from '../message-bot.dto';
import {
  SlackMessageBotSendMessageReqBody,
  SlackMessageBotSendMessageRes,
} from './slack.interface';
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

  async createChannel(body: MessageBotCreateChannelReqDto) {
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

  async updateChannel(body: MessageBotUpdateChannelReqDto) {
    const {id} = body;
    return await this.prisma.messageBotChannel.update({
      where: {id},
      data: {...body},
    });
  }

  async deleteChannel(body: MessageBotUpdateChannelReqDto) {
    const {id} = body;

    return await this.prisma.messageBotChannel.update({
      where: {id},
      data: {deletedAt: new Date()},
    });
  }

  async sendMessage(
    req: SlackMessageBotSendMessageReqDto
  ): Promise<SlackMessageBotSendMessageResDto> {
    const {channelId, body} = req;
    const channel = await this.prisma.messageBotChannel.findUniqueOrThrow({
      where: {id: channelId},
    });

    const newRecord = await this.prisma.messageBotRecord.create({
      data: {
        channelId: channel.id,
        webhook: channel.webhook,
        status: MessageBotRecordStatus.Pending,
        request: body as object,
      },
    });

    const result: SlackMessageBotSendMessageResDto =
      await this.httpService.axiosRef
        .post<
          SlackMessageBotSendMessageReqBody,
          AxiosResponse<SlackMessageBotSendMessageRes>
        >(channel.webhook, body)
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

  async sendText(
    params: SlackMessageBotSendTextMessageReqDto
  ): Promise<SlackMessageBotSendMessageResDto> {
    return await this.sendMessage({
      channelId: params.channelId,
      body: {text: params.text},
    });
  }
}
