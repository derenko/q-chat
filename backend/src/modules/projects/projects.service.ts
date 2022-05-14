import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAgentDto,
  CreateHandbookDto,
  DeleteAgentDto,
  UpdateHandbookDto,
  UpdateProjectDto,
} from './dto';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';
import { throws } from 'assert';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getAgentsForProject(userId: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        userId,
      },
    });

    const ratings = await this.prisma.feedback.groupBy({
      by: ['agentId'],
      _avg: {
        rating: true,
      },
      orderBy: {
        agentId: 'desc',
      },
    });

    const chats = await this.prisma.chat.groupBy({
      by: ['agentId'],
      orderBy: {
        agentId: 'desc',
      },
      _count: true,
    });

    const agents = await this.prisma.agent.findMany({
      where: {
        projectId: project.id,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    const mapped = agents
      .map((agent) => {
        const rating = ratings.find((rating) => agent.id === rating.agentId);

        if (rating) {
          return {
            ...agent,
            rating: rating._avg.rating,
          };
        }

        return agent;
      })
      .map((agent) => {
        const chatsCount = chats.find((chat) => agent.id === chat.agentId);

        if (chatsCount) {
          return {
            ...agent,
            chatsCount: chatsCount._count,
          };
        }

        return agent;
      });

    return mapped;
  }

  async getClientsForProject(userId: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        userId,
      },
    });

    return this.prisma.client.findMany({
      where: {
        projectId: project.id,
      },
    });
  }

  async createAgent(userId: number, dto: CreateAgentDto) {
    const project = await this.prisma.project.findUnique({
      where: {
        userId,
      },
    });

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password,
      },
    });

    return this.prisma.agent.create({
      data: {
        projectId: project.id,
        userId: user.id,
        name: dto.name,
      },
      include: {
        user: true,
      },
    });
  }

  async deleteAgent(userId: number, agentId: number) {
    return this.prisma.agent.delete({
      where: {
        id: agentId,
      },
    });
  }

  async getStatisticForProject(userId: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        userId,
      },
    });

    const chats = await this.prisma.chat.groupBy({
      by: ['createdAt'],
      where: {
        projectId: project.id,
        status: 'CLOSED',
        createdAt: {
          gte: moment(moment()).subtract(7, 'days').toDate(),
          lt: moment(moment()).toDate(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const clients = await this.prisma.client.groupBy({
      by: ['createdAt'],
      where: {
        projectId: project.id,
        createdAt: {
          gte: moment(moment()).subtract(7, 'days').toDate(),
          lt: moment(moment()).toDate(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      chats,
      clients,
    };
  }

  async createHandbookForProject(userId: number, dto: CreateHandbookDto) {
    const project = await this.prisma.project.findUnique({
      where: {
        userId,
      },
    });

    return this.prisma.handbook.create({
      data: {
        ...dto,
        projectId: project.id,
      },
    });
  }

  async getHandbooksForProject(userId: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        userId,
      },
    });

    return this.prisma.handbook.findMany({
      where: {
        projectId: project.id,
      },
    });
  }

  async updateHandbookForProject(
    userId: number,
    handbookId: number,
    dto: UpdateHandbookDto,
  ) {
    const project = await this.prisma.project.findUnique({
      where: {
        userId,
      },
    });

    return this.prisma.handbook.updateMany({
      where: {
        projectId: project.id,
        id: handbookId,
      },
      data: dto,
    });
  }

  async deleteHandbookForProject(userId: number, handbookId: number) {
    const project = await this.prisma.project.findUnique({
      where: { userId },
    });

    return this.prisma.handbook.deleteMany({
      where: {
        projectId: project.id,
        id: handbookId,
      },
    });
  }

  updateProject(userId, dto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: {
        userId,
      },
      data: dto,
    });
  }
}
