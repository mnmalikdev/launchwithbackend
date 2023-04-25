import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateProjectDTO } from '../DTOs/createProject.dto';
import { Project } from '../entities/projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) public projectRepository: Repository<Project>,
  ) {}

  async createProject(userId: string, createProjectDto: CreateProjectDTO) {
    const project = new Project();
    project.projectId = uuidv4();
    project.name = createProjectDto.name;
    project.industry = createProjectDto.industry;
    project.basicInfo = createProjectDto.basicInfo;
    project.moreInfo = createProjectDto.moreInfo;
    project.category = createProjectDto.category;
    project.stage = createProjectDto.stage;
    project.companyUrl = createProjectDto.companyUrl ?? undefined;
    project.projectOwner = <any>{ userId: userId };
    if (createProjectDto.contributerUserIds) {
      project.contributerInProjects = <any>(
        createProjectDto?.contributerUserIds?.map((contributerId) => {
          return <any>{ userId: contributerId };
        })
      );
    }
    await this.projectRepository.save(project);
  }

  async fetchAllProjects() {
    const projects = await this.projectRepository.find();
    return projects ?? [];
  }
}
