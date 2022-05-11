import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chats/chat.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards';
import { ConfigModule } from './config';
import { AgentsService } from './modules/agents/agents.service';
import { AgentsModule } from './modules/agents/agents.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ChatModule,
    PrismaModule,
    AuthModule,
    JwtModule.register({}),
    ConfigModule,
    AgentsModule,
    ProjectsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    AgentsService,
  ],
})
export class AppModule {}
