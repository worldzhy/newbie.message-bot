import {ApiProperty} from '@nestjs/swagger';
import {IsObject, IsString} from 'class-validator';
import {LarkWebhookMessageType} from './lark.constants';

export class LarkMessageBotSendMessageRes {
  @ApiProperty({type: Number})
  code: number;

  @ApiProperty({type: String})
  msg: string;

  @ApiProperty({type: Number})
  data: unknown;
}

export class LarkMessageBotSendMessageReqBody {
  @ApiProperty({type: String, enum: LarkWebhookMessageType})
  @IsString()
  msg_type: string;

  @ApiProperty({type: Object})
  @IsObject()
  content: object;
}
