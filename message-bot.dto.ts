import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsString, IsNumber, IsOptional, IsNotEmpty} from 'class-validator';
import {
  CommonPaginationReqDto,
  CommonPaginationResDto,
} from '@framework/common.dto';
import {MessageBotRecordStatus} from './message-bot.constants';

export class MessageBotCreateChannelReqDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  webhook: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class MessageBotUpdateChannelReqDto {
  @ApiProperty({
    type: String,
  })
  @IsNumber()
  id: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  webhook?: string;
}

export class MessageBotListChannelsReqDto extends CommonPaginationReqDto {}

export class MessageBotChannelDetailResDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  webhook: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}

export class MessageBotListChannelsResDto {
  @ApiProperty({
    type: MessageBotChannelDetailResDto,
    isArray: true,
  })
  records: MessageBotChannelDetailResDto[];

  @ApiProperty({
    type: CommonPaginationResDto,
  })
  pagination: CommonPaginationResDto;
}

export class MessageBotListMessagesReqDto extends CommonPaginationReqDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  channelId: string;
}

class MessageBotRecordDetailResDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  channelId: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  reqContext: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  resContext: string;

  @ApiProperty({
    type: String,
    enum: MessageBotRecordStatus,
  })
  @IsString()
  status: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}

export class MessageBotListMessagesResDto {
  @ApiProperty({
    type: MessageBotRecordDetailResDto,
    isArray: true,
  })
  records: MessageBotRecordDetailResDto[];

  @ApiProperty({
    type: CommonPaginationResDto,
  })
  pagination: CommonPaginationResDto;
}
