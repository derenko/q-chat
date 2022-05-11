import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { ChatService } from './chat.service';
import { CreateChatDto, CreateFeedbackDto } from './dto';
import { ChatEvents } from './enums';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async onClientJoin(socket: Socket, clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (client) {
      socket.data.client = client;

      const chat = await this.prisma.chat.findFirst({
        where: {
          clientId: client.id,
          OR: [{ status: 'OPEN' }, { status: 'ACTIVE' }],
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

      if (chat) {
        await socket.join(chat.id);

        socket.emit(ChatEvents.ClientSetChat, chat);
      }
    }
  }

  async onAgentJoin(socket: Socket, agentId: number) {
    const chats = await this.chatService.findActiveChatsForAgent(agentId);

    const agent = await this.prisma.agent.findUnique({
      where: {
        userId: agentId,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        userId: true,
      },
    });

    socket.data.agent = agent;

    for await (const chat of chats) {
      socket.join(chat.id);
    }
  }

  async emitToAgents(event: string, data: unknown) {
    const sockets = await this.server.fetchSockets();

    const agentsSockets = sockets
      .filter((socket) => socket.data.agent)
      .map((socket) => socket.id);

    this.server.to(agentsSockets).emit(event, data);
  }

  async emitToClients(event: string, data: unknown) {
    const sockets = await this.server.fetchSockets();

    const clientsSockets = sockets
      .filter((socket) => socket.data.client)
      .map((socket) => socket.id);

    this.server.to(clientsSockets).emit(event, data);
  }

  async handleConnection(socket: Socket) {
    const agentToken = socket.handshake.auth.agentToken;
    const clientToken = socket.handshake.auth.clientToken;

    if (agentToken) {
      try {
        const { id } = this.jwtService.decode(agentToken) as { id: number };

        await this.onAgentJoin(socket, id);
      } catch (e) {
        console.log(`Cannot authorize agent, agent not found.`, e);
      }
    }

    if (clientToken) {
      try {
        await this.onClientJoin(socket, clientToken);
      } catch (e) {
        console.log('client chat not found', e);
      }
    }
  }

  async handleDisconnect() {
    return;
  }

  @SubscribeMessage(ChatEvents.ClientJoinChat)
  async onClientJoined(socket: Socket, data: CreateChatDto) {
    const chat = await this.chatService.createChat(data);

    socket.data.client = chat.client;

    await socket.join(chat.id);

    await this.emitToAgents(ChatEvents.ChatOpen, chat);

    socket.emit(ChatEvents.ChatOpen, chat);
  }

  @SubscribeMessage(ChatEvents.ClientSendMessage)
  async onClientSendMessage(_: Socket, data) {
    const chat = await this.chatService.findById(data.chatId);

    const message = await this.chatService.sendMessageToChat({
      chatId: chat.id,
      text: data.text,
      from: 'CLIENT',
    });

    this.server.to(chat.id).emit(ChatEvents.ChatMessage, message);
  }

  @SubscribeMessage(ChatEvents.ClientSeenMessage)
  async onClientSeenMessage(_: Socket, data) {
    const updatedChat = await this.chatService.markMessagesAsSeen(
      data.chatId,
      'AGENT',
    );

    const chat = await this.chatService.findById(data.chatId);

    this.server.to(chat.id).emit(ChatEvents.AgentChatUpdated, updatedChat);
  }

  @SubscribeMessage(ChatEvents.AgentJoinChat)
  async onAgentJoined(socket: Socket, data) {
    const chat = await this.chatService.findById(data.chatId);

    await socket.join(chat.id);

    const updatedChat = await this.chatService.joinAgentToChat(
      data.chatId,
      socket.data.agent.id,
    );

    this.server.to(chat.id).emit(ChatEvents.ClientChatUpdated, updatedChat);
    this.server.to(chat.id).emit(ChatEvents.AgentChatUpdated, updatedChat);

    await this.emitToAgents(ChatEvents.AgentTakeChat, updatedChat);
  }

  @SubscribeMessage(ChatEvents.AgentSendMessage)
  async onAgentSendMessage(_: Socket, data) {
    const chat = await this.chatService.findById(data.chatId);

    const message = await this.chatService.sendMessageToChat({
      chatId: chat.id,
      text: data.text,
      from: 'AGENT',
    });

    this.server.to(chat.id).emit(ChatEvents.ChatMessage, message);
  }

  @SubscribeMessage(ChatEvents.AgentSeenMessage)
  async onAgentSeenMessage(_: Socket, data) {
    const chat = await this.chatService.findById(data.chatId);

    if (chat.status === 'ACTIVE') {
      await this.chatService.markMessagesAsSeen(chat.id, 'CLIENT');

      const updatedChat = await this.prisma.chat.findUnique({
        where: {
          id: data.chatId,
        },
        include: {
          agent: true,
          client: true,
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      this.server.to(chat.id).emit(ChatEvents.AgentChatUpdated, updatedChat);
    }
  }

  @SubscribeMessage(ChatEvents.AgentGetChats)
  async onAgentGetChats(socket: Socket) {
    const chats = await this.chatService.findCurrentChats(socket.data.agentId);

    socket.emit(ChatEvents.AgentSetChats, chats);
  }

  @SubscribeMessage(ChatEvents.AgentStartTyping)
  async onAgentStartTyping(_: Socket, data) {
    this.server.to(data.chatId).emit(ChatEvents.AgentStartTyping);
  }

  @SubscribeMessage(ChatEvents.AgentStopTyping)
  async onAgentStopTyping(_: Socket, data) {
    this.server.to(data.chatId).emit(ChatEvents.AgentStopTyping);
  }

  @SubscribeMessage(ChatEvents.ClientStartTyping)
  async onClientStartTyping(_: Socket, data) {
    this.server.to(data.chatId).emit(ChatEvents.ClientStartTyping);
  }

  @SubscribeMessage(ChatEvents.ClientStopTyping)
  async onClientStopTyping(_: Socket, data) {
    this.server.to(data.chatId).emit(ChatEvents.ClientStopTyping);
  }

  @SubscribeMessage(ChatEvents.AgentCloseChat)
  async agentCloseChat(_: Socket, data) {
    const chat = await this.chatService.closeChat(data.chatId);
    this.server.to(chat.id).emit(ChatEvents.ChatClosed, chat);
  }

  @SubscribeMessage(ChatEvents.ClientSendFeedback)
  async clientSendFeedback(_: Socket, data: CreateFeedbackDto) {
    await this.prisma.feedback.create({
      data: {
        rating: data.rating,
        chatId: data.chatId,
        clientId: data.clientId,
        agentId: data.agentId,
      },
    });

    this.server.to(data.chatId).emit(ChatEvents.AgentGetFeedback, data.rating);
  }

  @SubscribeMessage(ChatEvents.ClientGetOnlineAgents)
  async getOnlineAgents(socket: Socket) {
    const agents = await this.prisma.agent.findMany({
      where: {
        isOnline: true,
      },
    });

    socket.emit(ChatEvents.ClientSetOnlineAgents, agents);
  }
}
