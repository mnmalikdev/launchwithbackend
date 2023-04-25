import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomMailService } from 'src/mails/mailer.service';
import { Project } from 'src/projects/entities/projects.entity';
import { AuthController } from './controllers/auth.controller';
import { User } from './entites/user.entity';
import { GithubStrategy } from './github-login/github-oauthStrategy';
import { GoogleStrategy } from './google-login/google-oauthStrategy';
import { LinkedinStrategy } from './likedin-login/linkedin-oauthStrategy';
import { AuthService } from './services/auth.service';
import { AtStrategy, RtStrategy } from './stratergies';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User, Project])],
  controllers: [AuthController],
  providers: [
    AtStrategy,
    RtStrategy,
    AuthService,
    GoogleStrategy,
    GithubStrategy,
    LinkedinStrategy,
    CustomMailService,
  ],
})
export class AuthModule {}
