import {ApiProperty} from '@nestjs/swagger';
import {IsObject, IsString, ValidateNested, IsDefined} from 'class-validator';
import {Type} from 'class-transformer';
import {LarkWebhookMessageType} from './lark.constants';

export class LarkWebhookPostResDto {
  @ApiProperty({
    type: Number,
  })
  code: number;

  @ApiProperty({
    type: String,
  })
  msg: string;

  @ApiProperty({
    type: Number,
  })
  data: unknown;
}

export class LarkWebhookPostBodyDto {
  @ApiProperty({
    type: String,
    enum: LarkWebhookMessageType,
  })
  @IsString()
  msg_type: string;

  @ApiProperty({
    type: Object,
  })
  @IsObject()
  content: object;
}

export class LarkMessageBotReqDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  channelName: string;

  @ApiProperty({
    type: LarkWebhookPostBodyDto,
  })
  @Type(() => LarkWebhookPostBodyDto)
  @ValidateNested()
  @IsDefined()
  body: LarkWebhookPostBodyDto;
}

export class LarkMessageBotResDto {
  @ApiProperty({
    type: Object,
    required: false,
  })
  res?: object;

  @ApiProperty({
    type: Object,
    required: false,
  })
  error?: object;
}
