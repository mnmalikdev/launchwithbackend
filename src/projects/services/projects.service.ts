import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/auth/0auth2.0/entites/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AddContributorDto } from '../DTOs/addContributer.dto';
import { CreateProjectDTO } from '../DTOs/createProject.dto';
import { RemoveContributerDto } from '../DTOs/removeContributer.dto';
import { SearchProjectsDto } from '../DTOs/searchProject.dto';
import { Project } from '../entities/projects.entity';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) public projectRepository: Repository<Project>,
    @InjectRepository(User) public userRepository: Repository<User>,
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
    project.companyUrl = createProjectDto.companyUrl;
    project.startDate = createProjectDto.startDate;

    project.projectOwner = <any>{ userId };
    if (createProjectDto.contributerUserIds) {
      project.contributerInProjects = <any>(
        createProjectDto?.contributerUserIds.map((contributer) => {
          return <any>{ userId: contributer };
        })
      );
    }
    await this.projectRepository.save(project);

    return {
      status: 'sucess',
      data: project,
    };
  }

  async fetchAllProjects() {
    const projects = await this.projectRepository.find();

    return projects ?? [];
  }

  async deleteProject(projectId: string) {
    const project = await this.projectRepository.findOne({
      where: {
        projectId: projectId,
      },
    });

    if (!project) {
      throw new NotFoundException(' NO SUCH PROJECT FOUND !');
    }

    await this.projectRepository.delete({
      projectId: projectId,
    });

    return {
      status: 'sucess',
      message: 'project deleted !',
    };
  }

  async fetchProject(projectId: string) {
    const project = await this.projectRepository.findOne({
      where: {
        projectId: projectId,
      },
    });
    if (!project) {
      throw new NotFoundException(' NO SUCH PROJECT FOUND !');
    }
    return project;
  }

  async fetchProjectsForOwner(userId: string) {
    const projects = await this.projectRepository.find({
      where: {
        projectOwner: <any>{ userId: userId },
      },
      relations: ['contributerInProjects'],
    });
    return projects;
  }

  async fetchProjectsForContributer(userId: string) {
    const projects = await this.projectRepository.find({
      relations: ['contributerInProjects'],
      where: {
        contributerInProjects: { userId },
      },
    });
    if (!projects) {
      return [];
    }
    return projects;
  }

  async addContributorToProject(addContributorDto: AddContributorDto) {
    const { projectId, userId } = addContributorDto;

    const project = await this.projectRepository.findOne({
      where: { projectId },
      relations: ['contributerInProjects'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    // Check if the user is already a contributor in the project
    const existingContributor = project.contributerInProjects.find(
      (contributor) => contributor.userId === userId,
    );
    if (existingContributor) {
      throw new BadRequestException(
        `User with id ${userId} is already a contributor in the project`,
      );
    }

    const contributerId = <any>{ userId };

    project.contributerInProjects.push(contributerId);
    await this.projectRepository.save(project);

    return {
      message: `User with id ${userId} has been added as a contributor to project with id ${projectId}`,
    };
  }

  async removeContributorFromProject(
    removeContributorDto: RemoveContributerDto,
  ) {
    const { projectId, userId } = removeContributorDto;

    const project = await this.projectRepository.findOne({
      where: { projectId },
      relations: ['contributerInProjects'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    // Check if the user is a contributor in the project
    const existingContributorIndex = project.contributerInProjects.findIndex(
      (contributor) => contributor.userId === userId,
    );
    if (existingContributorIndex === -1) {
      throw new BadRequestException(
        `User with id ${userId} is not a contributor in the project`,
      );
    }

    project.contributerInProjects.splice(existingContributorIndex, 1);
    await this.projectRepository.save(project);

    return {
      message: `User with id ${userId} has been removed as a contributor from project with id ${projectId}`,
    };
  }

  async likeProject(userId: string, projectId: string) {
    const project = await this.projectRepository.findOne({
      where: {
        projectId: projectId,
      },
      relations: ['likedBy'],
    });

    if (!project) {
      throw new NotFoundException('no project found');
    }

    project.likedBy.push(<any>{ userId });

    await this.projectRepository.save(project);

    return project;
  }

  async unlikeProject(userId: string, projectId: string) {
    const project = await this.projectRepository.findOne({
      where: {
        projectId: projectId,
      },
      relations: ['likedBy'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const userIndex = project.likedBy.findIndex(
      (likedUser) => likedUser.userId === userId,
    );

    if (userIndex === -1) {
      throw new NotFoundException('Project not liked by user');
    }

    project.likedBy.splice(userIndex, 1);

    await this.projectRepository.save(project);

    return project;
  }

  async fetchLikedProjects(userId: string) {
    const projects = await this.projectRepository.find({
      relations: ['likedBy'],
      where: {
        likedBy: { userId },
      },
    });
    return projects ?? [];
  }

  async searchProjects(searchProjectsDto: SearchProjectsDto) {
    const { industries, stages, categories } = searchProjectsDto;

    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    if (industries && industries.length) {
      queryBuilder.andWhere('project.industry IN (:...industries)', {
        industries,
      });
    }

    if (stages && stages.length) {
      queryBuilder.andWhere('project.stage IN (:...stages)', { stages });
    }

    if (categories && categories.length) {
      queryBuilder.andWhere('project.category IN (:...categories)', {
        categories,
      });
    }

    const projects = await queryBuilder.getMany();

    if (projects.length === 0) {
      throw new NotFoundException('NO PROJECTS FOUND');
    }

    return projects;
  }
}
