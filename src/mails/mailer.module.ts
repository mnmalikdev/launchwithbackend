import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { CustomMailService } from './mailer.service';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        secure: false,
        auth: {
          user: 'officiallaunchwith@gmail.com',
          pass: 'fVkdgMpKvY78SFTG',
        },
      },
      defaults: {
        from: 'launchwith.official@gmail.com',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [CustomMailService, JwtService],
  exports: [CustomMailService], // 👈 export for DI
})
export class MailModule {}
