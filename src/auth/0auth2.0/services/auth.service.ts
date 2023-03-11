/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LogInDTO } from '../DTOs/login.dto';
import { SignUpDTO } from '../DTOs/signup.dto';
import { User } from '../entites/user.entity';
import { Role } from '../enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
    @Inject(forwardRef(() => JwtService))
    private jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello Authservice!';
  }

  //Google 0auth business logic
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  //github 0auth business logic
  githubLogin(req: any) {
    if (!req.user) {
      return 'No user from github';
    }

    return {
      message: 'User information from github',
      user: req.user,
    };
  }

  //linkedin 0auth business logic
  linkedinLogin(req: any) {
    if (!req.user) {
      return 'No user from linkedin';
    }

    return {
      message: 'User information from linkedin',
      user: req.user,
    };
  }

  // **************************** jwt based auth**********************************************************

  async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string, role: Role) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: role,
        },
        {
          secret: process.env.AT_SECRET,
          expiresIn: process.env.AT_EXPIRY,
          //15 minutes
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: role,
        },
        {
          secret: process.env.RT_SECRET,
          expiresIn: process.env.RT_EXPIRY,
        },
      ),
    ]);
    // generated rt and at tokens.
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async UpdateRtHash(userId: string, rt: string | null) {
    const hashedRt = await this.hashData(rt);
    const user = await this.userRepository.findOne({
      where: {
        userId: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('No such user exists');
    }

    await this.userRepository.update({ hashedRt: user.hashedRt }, { hashedRt });
  }

  async signUp(signupDTO: SignUpDTO) {
    const user = await this.userRepository.findOne({
      where: { email: signupDTO.email },
    });

    if (user) {
      throw new ForbiddenException('email already exists');
    }

    const newUser = new User();
    newUser.userId = uuidv4();
    newUser.email = signupDTO.email;
    newUser.userName = signupDTO.userName;

    const hashedPassword = await this.hashData(signupDTO.password);

    newUser.password = hashedPassword;

    return await this.userRepository.save(newUser);
  }

  async logIn(loginDTO: LogInDTO) {
    const user = await this.userRepository.findOne({
      where: { email: loginDTO.email },
    });
    if (!user) {
      throw new NotFoundException('No such user exists');
    }

    const passwordMatchs = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (!passwordMatchs) {
      throw new ForbiddenException('email or Password incorrect');
    }

    const tokens = await this.getTokens(user.userId, user.email, user.role);
    await this.UpdateRtHash(user.userId, tokens.refresh_token);
    return {
      tokens,
      user,
    };
  }

  async refreshTokens() {}

  async Logout(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (user.hashedRt !== null) {
      return await this.userRepository.update(
        { hashedRt: user.hashedRt },
        { hashedRt: null },
      );
    }
  }
}
