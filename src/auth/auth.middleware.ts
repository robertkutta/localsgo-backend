import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class ClerkAuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;
    const method = req.method;

    const isProtectedMethod = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(
      method,
    );

    if (!isProtectedMethod) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication required');
    }

    const token = authHeader.substring(7);
    const session = await this.authService.verifyToken(token);

    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }
    req['user'] = session;
    next();
  }
}
