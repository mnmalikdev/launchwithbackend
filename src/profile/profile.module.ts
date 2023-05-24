import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/0auth2.0/entites/user.entity';
import { GoogleDriveService } from 'src/google-cloud/google-cloud.service';
import { ProfileController } from './controllers/profile.controller';
import { Skill } from './entities/skills.entity';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Skill])],
  controllers: [ProfileController],
  providers: [ProfileService, GoogleDriveService],
})
export class ProfileModule {}
