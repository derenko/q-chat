import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
@Module({
  providers: [ChatGateway, ChatService],
  imports: [JwtModule.register({})],
})
export class ChatModule {}
