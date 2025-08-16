// Nest
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger('Roles Guard');

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User not authenticated');
    }

    this.logger.log(`currentLoggedInUser: ', ${user}`);

    const hasRole = requiredRoles.some((role) =>
      user.accessRole.includes(role),
    ); // Check if user has required role
    if (!hasRole) {
      throw new ForbiddenException('User does not have permission');
    }

    return true;
  }
}
