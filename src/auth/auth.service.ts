/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {


  getHello(): string {
    return 'Hello Authservice!';
  }

  //Google 0auth business logic
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }

  //github 0auth business logic
  githubLogin(req: any) {
    if (!req.user) {
      return 'No user from github'
    }

    return {
      message: 'User information from github',
      user: req.user
    }
  }

  //linkedin 0auth business logic
  linkedinLogin(req: any) {
    if (!req.user) {
      return 'No user from linkedin'
    }

    return {
      message: 'User information from linkedin',
      user: req.user
    }
  }
}