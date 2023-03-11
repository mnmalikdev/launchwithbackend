/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    //TypeOrmModule.forRoot({
      //type: process.env.DB_TYPE as any,
      //port: parseInt(process.env.DB_PORT),
      //host: process.env.DB_HOST,
      //username: process.env.DB_USERNAME,
      //password: process.env.PASSWORD,
      //database: process.env.DB_NAME,

      //entities: [],

      //synchronize: true,
    //}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
