/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { LogInDTO } from '../DTOs/login.dto';
import { SignUpDTO } from '../DTOs/signup.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
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
      msg: 'Google authentication',
    };
  }

  // /auth/google/redirect
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
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
      msg: 'Github authentication',
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
      msg: 'linkedin authentication',
    };
  }

  @Get('linkedin/redirect')
  @UseGuards(AuthGuard('github'))
  linkedinAuthRedirect(@Req() req) {
    return this.authService.linkedinLogin(req);
  }

  // **************************** jwt based auth**********************************************************

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    description: 'User has been created',
  })
  @ApiOperation({
    summary: 'Create a new user and generate his access and refresh tokens',
  })
  async signUp(@Body() signupDTO: SignUpDTO) {
    return await this.authService.signUp(signupDTO);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User logs in / authenticated with access and refres tokens',
  })
  @ApiOperation({ summary: 'login using email and password' })
  async logIn(@Body() loginDTO: LogInDTO) {
    return await this.authService.logIn(loginDTO);
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate new tokens' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Refresh token . Example "Bearer {token}"',
    example: 'Bearer <token>',
    allowEmptyValue: false,
    required: true,
  })
  async refreshToken(@Req() req: Request) {
    const user = req.user;
    const tokens = req['tokens'];
    console.log(user);
    return await this.authService.refreshTokens(
      user['sub'],
      tokens['refreshToken'],
    );
  }

  @Get('/verifyUser')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint to verify a user after signing up' })
  async verifyUser(@Query('token') token: string) {
    await this.authService.verifyNewCreatedUser(token);
    return { status: 'Success', message: 'User verified ' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'nullifies user tokens and log out of app',
  })
  @ApiOperation({ summary: 'user access to app is suspended' })
  async logOut(@Req() req: Request) {
    console.log(req.user);
    return await this.authService.Logout(req.user['sub']);
  }
}
