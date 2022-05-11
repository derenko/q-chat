import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from 'src/config';
import { ErrorMessages } from 'src/common/enums/error-messages';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (isPasswordValid) {
        const { accessToken, refreshToken } = await this.getTokens(user);

        await this.updateUserRefreshToken(user.id, refreshToken);

        return {
          accessToken,
          refreshToken,
          role: user.role,
        };
      } else {
        throw new ForbiddenException(ErrorMessages.InvalidCredentials);
      }
    } else {
      throw new ForbiddenException(ErrorMessages.InvalidCredentials);
    }
  }

  async signUp(dto: SignUpDto) {
    const isUserExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (isUserExists) {
      throw new ConflictException(ErrorMessages.EmailAlreadyExists);
    }

    try {
      const password = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: password,
          role: 'PROJECT',
          project: {
            create: {
              name: dto.name,
              website: dto.website,
            },
          },
        },
      });

      const { accessToken, refreshToken } = await this.getTokens(user);

      await this.updateUserRefreshToken(user.id, refreshToken);

      return { accessToken, refreshToken };
    } catch (e) {
      return e;
    }
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user && user.hashedRefreshToken) {
      const isValidRefreshToken = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (isValidRefreshToken) {
        const { accessToken, refreshToken } = await this.getTokens(user);

        await this.updateUserRefreshToken(user.id, refreshToken);

        return {
          accessToken,
          refreshToken,
        };
      } else {
        throw new ForbiddenException(ErrorMessages.InvalidRefreshToken);
      }
    } else {
      throw new ForbiddenException(ErrorMessages.InvalidRefreshToken);
    }
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
  }

  async getTokens(user: Partial<User>) {
    const data = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: '1h',
      }),

      this.jwtService.signAsync(data, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '14d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateUserRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }

  async getMe(userId) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (user.role === 'AGENT') {
      const agent = await this.prisma.agent.findUnique({
        where: {
          userId: user.id,
        },
      });

      const project = await this.prisma.project.findUnique({
        where: {
          id: agent.projectId,
        },
      });

      return {
        ...user,
        agent,
        project,
      };
    } else {
      const project = await this.prisma.project.findUnique({
        where: {
          userId: user.id,
        },
      });

      return {
        ...user,
        project,
      };
    }
  }
}
