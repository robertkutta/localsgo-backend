import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Clerk } from '@clerk/clerk-sdk-node';

@Injectable()
export class AuthService {
  private clerk: any;
  private readonly logger = new Logger(AuthService.name);

  constructor(private configService: ConfigService) {
    this.clerk = Clerk({
      secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
    });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const jwt = await this.clerk.verifyToken(token);
      this.logger.log('JWT token verified');
      return jwt;
    } catch (error) {
      this.logger.warn(`Token verification failed: ${error.message}`);
      return null;
    }
  }
}
