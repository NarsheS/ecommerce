import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from 'src/user/user.entity';

// Isso aqui é para restringir o uso de algumas funções para os usuários comuns
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. GET - Pega as roles definidas usando @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se não precisa de uma Role → Permite acesso
    if (!requiredRoles) return true;

    // 2. Extraí usuário autenticado
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verifica usuário e logo depois se ele tem uma role
    if (!user) {
      throw new ForbiddenException('You must be logged in to access this resource.');
    }

    if (!user.role) {
      throw new ForbiddenException('User role missing in authentication token.');
    }

    // 3. Checa autorização
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}
