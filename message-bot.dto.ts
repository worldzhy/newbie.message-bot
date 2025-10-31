import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNumber, IsOptional, IsNotEmpty} from 'class-validator';
import {
  CommonListRequestDto,
  CommonListResponseDto,
} from '@framework/common.dto';
import {MessageBotRecordStatus} from './message-bot.constants';

class MessageBotChannelDetailResDto {
  @ApiProperty({type: String})
  id: string;

  @ApiProperty({type: String})
  @IsString()
  name: string;

  @ApiProperty({type: String})
  @IsString()
  webhook: string;

  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({type: Date})
  createdAt: Date;

  @ApiProperty({type: Date})
  updatedAt: Date;
}

class MessageBotRecordDetailResDto {
  @ApiProperty({type: String})
  id: string;

  @ApiProperty({type: Number})
  @IsNumber()
  channelId: number;

  @ApiProperty({type: String})
  @IsString()
  reqContext: string;

  @ApiProperty({type: String})
  @IsString()
  resContext: string;

  @ApiProperty({type: String, enum: MessageBotRecordStatus})
  @IsString()
  status: string;

  @ApiProperty({type: Date})
  createdAt: Date;

  @ApiProperty({type: Date})
  updatedAt: Date;
}

export class ListMessageBotChannelsRequestDto extends CommonListRequestDto {}

export class ListMessageBotChannelsResponseDto extends CommonListResponseDto {
  @ApiProperty({type: MessageBotChannelDetailResDto, isArray: true})
  declare records: MessageBotChannelDetailResDto[];
}

export class CreateMessageBotChannelRequestDto {
  @ApiProperty({type: String})
  @IsString()
  name: string;

  @ApiProperty({type: String})
  @IsString()
  webhook: string;

  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateMessageBotChannelRequestDto {
  @ApiProperty({type: String})
  @IsNumber()
  id: string;

  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({type: String, required: false})
  @IsString()
  @IsOptional()
  webhook?: string;
}

export class ListMessageBotMessagesRequestDto extends CommonListRequestDto {
  @ApiProperty({type: String})
  @IsNotEmpty()
  @IsString()
  channelId: string;
}

export class ListMessageBotMessagesResponseDto extends CommonListResponseDto {
  @ApiProperty({type: MessageBotRecordDetailResDto, isArray: true})
  declare records: MessageBotRecordDetailResDto[];
}
