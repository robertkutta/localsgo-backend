import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Clerk from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('CLERK_SECRET_KEY');
    if (apiKey) {
      Clerk.setClerkApiKey(apiKey);
    }
  }

  async getEmail(userId: string): Promise<string | null> {
    try {
      const user = await Clerk.users.getUser(userId);
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId,
      );

      if (primaryEmail) {
        return primaryEmail.emailAddress;
      } else if (user.emailAddresses.length > 0) {
        return user.emailAddresses[0].emailAddress;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user from Clerk:', error);
      return null;
    }
  }
}
