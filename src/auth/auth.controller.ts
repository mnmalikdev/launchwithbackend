/* eslint-disable prettier/prettier */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  getHello(): string {
    return this.authService.getHello();
  }

  // /auth/google/login
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return {
      msg: 'Google authentication'
    };
  }

  // /auth/google/redirect
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req)
  }

  //@Get('status')
  //user(@Req() req: Request) {
    //console.log(req.user);
    //if (request.user) {
      //return { msg: 'Authenticated' };
    //} else {
      //return { msg: 'Not Authenticated' };
    //}
  //}

  @Get('github/login')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    return {
      msg: 'Github authentication'
    };
  }

  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Req() req) {
    return this.authService.githubLogin(req);
  }
  //async authCallback(@Req() req) {
    //return req.user;
  //}

  @Get('linkedin/login')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth(@Req() req) {
    return {
      msg: 'linkedin authentication'
    };
  }

  @Get('linkedin/redirect')
  @UseGuards(AuthGuard('github'))
  linkedinAuthRedirect(@Req() req) {
    return this.authService.linkedinLogin(req);
  }
}
