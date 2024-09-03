import {Module, Global} from '@nestjs/common';
import {LarkMessageBotController} from './lark/lark.controller';
import {LarkMessageBotService} from './lark/lark.service';
import {SlackMessageBotController} from './slack/slack.controller';
import {SlackMessageBotService} from './slack/slack.service';

@Global()
@Module({
  controllers: [LarkMessageBotController, SlackMessageBotController],
  providers: [LarkMessageBotService, SlackMessageBotService],
  exports: [LarkMessageBotService, SlackMessageBotService],
})
export class MessageBotModule {}
