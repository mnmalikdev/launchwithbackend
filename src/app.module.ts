/* eslint-disable prettier/prettier */
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/0auth2.0/auth.module';
import { GoogleDriveModule } from './google-cloud/google.module';
import { MailModule } from './mails/mailer.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectModule } from './projects/projects.module';
import dbConfig from './config/db.config';

@Module({
  imports: [
    AuthModule,
    MailModule,
    ProfileModule,
    ProjectModule,
    GoogleDriveModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      port: Number(process.env.DB_PORT),
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      autoLoadEntities: true,
      synchronize: true,
    }),

    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.gmail.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       user: 'launchwith.official@gmail.com',
    //       pass: 'Launchwith2@',
    //     },
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
