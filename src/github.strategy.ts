import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-github';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: 'fb65cc1848303972e11a',
      clientSecret: '4ab813018ae6913fa19972f9e959a1e5a56f2a84',
      callbackURL: 'http://localhost:3001/api/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('I am here');
    console.log(accessToken, refreshToken, profile);
    try {
      return { accessToken, profile };
    } catch (error) {
      throw error;
    }
  }
}
