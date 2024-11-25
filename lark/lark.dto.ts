import {ApiProperty} from '@nestjs/swagger';
import {IsString, ValidateNested, IsDefined} from 'class-validator';
import {Type} from 'class-transformer';
import {LarkMessageBotSendMessageReqBody} from './lark.interface';

export class LarkMessageBotSendMessageReqDto {
  @ApiProperty({type: String})
  @IsString()
  channelId: string;

  @ApiProperty({type: LarkMessageBotSendMessageReqBody})
  @Type(() => LarkMessageBotSendMessageReqBody)
  @ValidateNested()
  @IsDefined()
  body: LarkMessageBotSendMessageReqBody;
}

export class LarkMessageBotSendTextMessageReqDto {
  @ApiProperty({type: String})
  @IsString()
  channelId: string;

  @ApiProperty({type: String})
  @IsString()
  text: string;
}

export class LarkMessageBotSendMessageResDto {
  @ApiProperty({type: Object, required: false})
  res?: object;

  @ApiProperty({type: Object, required: false})
  error?: object;
}
