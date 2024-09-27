import {HttpService} from '@nestjs/axios';
import {AxiosResponse, AxiosError} from 'axios';
import {Injectable, BadRequestException} from '@nestjs/common';
import {PrismaService} from '@framework/prisma/prisma.service';
import {LarkWebhookSendStatus} from './lark.constants';
import {
  LarkMessageBotReqDto,
  LarkMessageBotResDto,
  LarkWebhookPostResDto,
  LarkWebhookPostBodyDto,
} from './lark.dto';
import {
  MessageBotChannelCreateReqDto,
  MessageBotChannelUpdateReqDto,
} from '../message-bot.dto';
import {
  MessageBotPlatform,
  MessageBotRecordStatus,
} from '../message-bot.constants';

@Injectable()
export class LarkMessageBotService {
  constructor(
    private httpService: HttpService,
    private readonly prisma: PrismaService
  ) {}

  async createChannel(body: MessageBotChannelCreateReqDto) {
    const {name} = body;
    const channel = await this.prisma.messageBotChannel.findFirst({
      where: {name, platform: MessageBotPlatform.Lark},
    });
    if (channel) {
      throw new BadRequestException('Channel name already exists');
    }

    return await this.prisma.messageBotChannel.create({
      data: {...body, platform: MessageBotPlatform.Lark},
    });
  }

  async updateChannel(body: MessageBotChannelUpdateReqDto) {
    const {id} = body;
    return await this.prisma.messageBotChannel.update({
      where: {id},
      data: {...body},
    });
  }

  async deleteChannel(body: MessageBotChannelUpdateReqDto) {
    const {id} = body;

    return await this.prisma.messageBotChannel.update({
      where: {id},
      data: {deletedAt: new Date()},
    });
  }

  async sendText(params: {
    channelName: string;
    text: string;
  }): Promise<LarkMessageBotResDto> {
    return await this.send({
      channelName: params.channelName,
      body: {msg_type: 'text', content: {text: params.text}},
    });
  }

  async send(req: LarkMessageBotReqDto): Promise<LarkMessageBotResDto> {
    const {channelName, body} = req;
    const channel = await this.prisma.messageBotChannel.findUniqueOrThrow({
      where: {
        name_platform: {
          name: channelName,
          platform: MessageBotPlatform.Lark,
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

    const result: LarkMessageBotResDto = await this.httpService.axiosRef
      .post<LarkWebhookPostBodyDto, AxiosResponse<LarkWebhookPostResDto>>(
        channel.webhook,
        body
      )
      .then(res => {
        if (res.data.code === LarkWebhookSendStatus.Succeeded) {
          return {res: res.data};
        } else {
          return {error: res.data};
        }
      })
      .catch((e: AxiosError) => {
        return {error: {message: e.message, response: e.response}};
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
