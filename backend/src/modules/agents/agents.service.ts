import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';
import { UpdateAgentDto } from './dto/update-profile.dto';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const agent = await this.prisma.agent.findUnique({
      where: {
        userId: userId,
      },
    });

    const chatsCount = await this.prisma.chat.count({
      where: {
        agentId: agent.id,
        status: 'CLOSED',
      },
    });

    const {
      _avg: { rating },
    } = await this.prisma.feedback.aggregate({
      where: {
        agentId: agent.id,
      },
      _avg: {
        rating: true,
      },
    });

    return {
      chatsCount,
      rating,
    };
  }

  async updateProfile(userId: number, dto: UpdateAgentDto) {
    return this.prisma.agent.update({
      where: {
        userId: userId,
      },
      data: {
        name: dto.name,
      },
    });
  }

  async getTemplatesForAgent(userId: number) {
    const agent = await this.prisma.agent.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    return this.prisma.template.findMany({
      where: {
        agentId: agent.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createTemplateForAgent(userId: number, dto: CreateTemplateDto) {
    const agent = await this.prisma.agent.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    return this.prisma.template.create({
      data: {
        text: dto.text,
        agentId: agent.id,
      },
    });
  }

  async updateTemplate(templateId: number, text: string) {
    return this.prisma.template.update({
      where: {
        id: templateId,
      },
      data: {
        text,
      },
    });
  }

  async deleteTemplate(templateId: number) {
    return this.prisma.template.delete({
      where: {
        id: templateId,
      },
    });
  }

  async updateOnlineStatus(userId: number, status: boolean) {
    return this.prisma.agent.update({
      where: {
        userId,
      },
      data: {
        isOnline: status,
      },
    });
  }

  async getHandbooks(userId: number) {
    const agent = await this.prisma.agent.findUnique({
      where: {
        userId,
      },
    });

    return await this.prisma.handbook.findMany({
      where: {
        projectId: agent.projectId,
      },
    });
  }
}
