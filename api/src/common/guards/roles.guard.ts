// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si no hay roles requeridos, permitir acceso
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new UnauthorizedException('Authentication required'); // No hay usuario autenticado o no tiene rol
    }

    if (!requiredRoles.some((role) => user.role === role)) {
      throw new ForbiddenException('Insufficient role'); // El usuario no tiene el rol requerido
    }

    return true;
  }
}