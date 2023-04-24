import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/0auth2.0/entites/user.entity';
import { ProfileController } from './controllers/profile.controller';
import { Skill } from './entities/skills.entity';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Skill])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
