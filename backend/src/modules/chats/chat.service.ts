import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chat, MessageStatus, Prisma, SentBy } from '@prisma/client';
import { CreateChatDto } from './dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findOne(input: Prisma.ChatFindUniqueArgs): Promise<Chat> {
    return this.prisma.chat.findUnique(input);
  }

  async findMany(input: Prisma.ChatFindManyArgs) {
    return this.prisma.chat.findMany(input);
  }

  async findChatsByAgentId(agentId: number): Promise<Chat[]> {
    return;
  }

  async findChatByClientId(clientId: string): Promise<Chat> {
    return;
  }

  async joinClientToChat(chatId: string, clientId: string) {
    return;
  }

  async joinAgentToChat(chatId: string, agentId: number) {
    const agent = await this.prisma.agent.findUnique({
      where: {
        id: agentId,
      },
    });

    return this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        agent: {
          connect: {
            id: agent.id,
          },
        },
        status: 'ACTIVE',
        messages: {
          create: [
            {
              text: `Оператор ${agent.name} в чаті`,
              from: 'BOT',
            },
          ],
        },
      },
      include: {
        agent: true,
        client: true,
        messages: true,
      },
    });
  }

  async createChat(dto: CreateChatDto) {
    return this.prisma.chat.create({
      data: {
        project: {
          connect: {
            id: dto.projectId,
          },
        },
        client: {
          create: {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            projectId: dto.projectId,
          },
        },
        messages: {
          create: [
            {
              text: 'Вітаємо в чаті!',
              from: 'BOT',
            },
          ],
        },
      },
      include: {
        client: true,
        messages: true,
      },
    });
  }

  async closeChat(chatId: string) {
    return this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        status: 'CLOSED',
        messages: {
          create: {
            text: 'Оператор завершив чат.',
          },
        },
      },
    });
  }

  async createMessage(chatId: string, message) {
    return;
  }

  async createFeedbackForChat(chatId, feedback) {
    return;
  }

  async markChatAsSeen(chatId: string) {
    return;
  }

  /*<--- OLD --->*/

  async findById(chatId: string) {
    return this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });
  }

  async findActiveChatsForAgent(agentId: number) {
    return this.prisma.chat.findMany({
      where: {
        agentId: agentId,
        status: 'ACTIVE',
      },
    });
  }

  async findCurrentChats(agentId: number) {
    const open = await this.prisma.chat.findMany({
      where: {
        status: 'OPEN',
      },
      include: {
        client: true,
        messages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const active = await this.prisma.chat.findMany({
      where: {
        agentId: agentId,
        status: 'ACTIVE',
      },
      include: {
        client: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        agent: true,
      },
    });

    return [...active, ...open];
  }

  async markMessagesAsSeen(chatId, from: SentBy) {
    return this.prisma.message.updateMany({
      where: {
        chatId: chatId,
        OR: [
          {
            from,
          },
          {
            from: 'BOT',
          },
        ],
      },
      data: {
        status: MessageStatus.SEEN,
      },
    });
  }

  async sendMessageToChat(dto: CreateMessageDto) {
    await this.prisma.chat.update({
      where: {
        id: dto.chatId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return this.prisma.message.create({
      data: {
        chatId: dto.chatId,
        text: dto.text,
        from: dto.from,
      },
    });
  }

  async findLastMessageForChat(chatId: string) {
    return this.prisma.message.findFirst({
      where: {
        chatId: chatId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
