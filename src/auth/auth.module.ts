/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './0auth2.0/google-login/google-oauthStrategy';
import { GithubStrategy } from './0auth2.0/github-login/github-oauthStrategy';
import { LinkedinStrategy } from './0auth2.0/likedin-login/linkedin-oauthStrategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, 
              GoogleStrategy,
              GithubStrategy,
              LinkedinStrategy
  ]
})
export class AuthModule {}
