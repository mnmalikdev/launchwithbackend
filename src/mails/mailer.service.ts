import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomMailService {
  constructor(
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async sendUserConfirmation(userId: string, email: string) {
    const token = await this.jwtService.signAsync(
      {
        email,
        sub: userId,
      },
      {
        secret: process.env.VERIFICATION_SECRET,
        expiresIn: '7d',
      },
    );
    const url = `${process.env.BASE_URL_FRONTEND}profile/accountConfirmation?token=${token}`;

    console.log('token==>', token);

    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to LaunchWith! Please Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: 'nabeel malik',
        url,
      },
    });
  }
}
