import {ApiProperty} from '@nestjs/swagger';

export class MessageBotChannelGroupEntity {
  @ApiProperty({type: String})
  id: string;

  @ApiProperty({type: String})
  name: string;

  @ApiProperty({type: String})
  description: string;

  @ApiProperty({type: Number})
  sort: number;

  @ApiProperty({type: String, required: false, nullable: true})
  parentId: string | null;

  @ApiProperty({type: Date})
  createdAt: Date;

  @ApiProperty({type: Date})
  updatedAt: Date;
}

export class MessageBotChannelEntity {
  @ApiProperty({type: String})
  id: string;

  @ApiProperty({type: String})
  name: string;

  @ApiProperty({type: String})
  description: string;

  @ApiProperty({type: String})
  webhook: string;

  @ApiProperty({type: String})
  platform: string;

  @ApiProperty({type: Date})
  createdAt: Date;

  @ApiProperty({type: Date})
  updatedAt: Date;

  @ApiProperty({type: Date})
  deletedAt: Date;

  @ApiProperty({type: String, required: false, nullable: true})
  groupId: string | null;
}
