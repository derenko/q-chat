import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '@prisma/client';

export const GetCurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user && request.user[data] : request.user;
  },
);
