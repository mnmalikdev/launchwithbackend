import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/0auth2.0/entites/user.entity';
import { GoogleDriveService } from 'src/google-cloud/google-cloud.service';
import { ProjectController } from './controllers/project.controller';
import { Project } from './entities/projects.entity';
import { ProjectsService } from './services/projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project])],
  controllers: [ProjectController],
  providers: [ProjectsService, GoogleDriveService],
})
export class ProjectModule {}
