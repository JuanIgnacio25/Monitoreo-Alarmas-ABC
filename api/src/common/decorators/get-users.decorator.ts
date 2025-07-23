//Obtiene el usurio a travez del accessToken y lo retorna
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);