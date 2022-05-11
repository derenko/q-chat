import { UserRole } from '@prisma/client';

export type AccessTokenJwtPayload = {
  id: number;
  email: number;
  role: UserRole;
};

export type RefreshTokenJwtPayload = {
  id: number;
  email: number;
  role: UserRole;
  refreshToken: string;
};
