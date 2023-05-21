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
import { EditProjectDTO } from '../DTOs/editProject.dto';
import { RemoveContributerDto } from '../DTOs/removeContributer.dto';
import { SearchProjectsDto } from '../DTOs/searchProject.dto';
import { Industry } from '../entities/industry.entity';
import { Project } from '../entities/projects.entity';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) public projectRepository: Repository<Project>,
    @InjectRepository(Industry) public industryRepository: Repository<Industry>,
    @InjectRepository(User) public userRepository: Repository<User>,
  ) {}

  async createProject(userId: string, createProjectDto: CreateProjectDTO) {
    const project = new Project();
    project.projectId = uuidv4();
    project.name = createProjectDto.name;
    project.basicInfo = createProjectDto.basicInfo;
    project.moreInfo = createProjectDto.moreInfo;
    project.stage = createProjectDto.stage;
    project.category = createProjectDto?.category;
    project.companyUrl = createProjectDto.companyUrl;
    console.log('startdate==>', createProjectDto?.startDate);
    console.log('typeof==>', typeof createProjectDto?.startDate);

    project.startDate = createProjectDto?.startDate;

    project.projectOwner = <any>{ userId };

    if (createProjectDto.contributerUserIds) {
      project.contributerInProjects = <any>(
        createProjectDto?.contributerUserIds.map((contributer) => {
          return <any>{ userId: contributer };
        })
      );
    }

    project.industry = createProjectDto?.industry?.map((industryName) => {
      const industry = new Industry();
      industry.industryId = uuidv4();
      industry.name = industryName;
      industry.belongsToProject = <any>{
        projectId: project.projectId,
      };

      return industry;
    });

    await this.projectRepository.save(project);

    return {
      status: 'sucess',
      data: project,
    };
  }

  async editProject(projectId: string, editProjectDto: EditProjectDTO) {
    console.log(editProjectDto);
    const project = await this.projectRepository.findOne({
      where: {
        projectId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (editProjectDto.name) {
      project.name = editProjectDto.name;
    }

    if (editProjectDto.basicInfo) {
      project.basicInfo = editProjectDto.basicInfo;
    }

    if (editProjectDto.moreInfo) {
      project.moreInfo = editProjectDto.moreInfo;
    }

    if (editProjectDto.stage) {
      project.stage = editProjectDto.stage;
    }

    if (editProjectDto.category) {
      project.category = editProjectDto.category;
    }

    if (editProjectDto.companyUrl) {
      project.companyUrl = editProjectDto.companyUrl;
    }

    if (editProjectDto.startDate) {
      project.startDate = editProjectDto.startDate;
    }

    if (editProjectDto.contributorUserIds) {
      project.contributerInProjects = <any>(
        editProjectDto?.contributorUserIds.map((contributer) => {
          return <any>{ userId: contributer };
        })
      );
    }

    project.industry = editProjectDto?.industry?.map((industryName) => {
      const industry = new Industry();
      industry.industryId = uuidv4();
      industry.name = industryName;
      industry.belongsToProject = <any>{
        projectId: project.projectId,
      };

      return industry;
    });

    await this.projectRepository.save(project);

    return {
      status: 'success',
      data: project,
    };
  }

  async fetchAllProjects() {
    const projects = await this.projectRepository.find({
      relations: [
        'likedBy',
        'industry',
        'projectOwner',
        'projectOwner.skills',
        'contributerInProjects',
      ],
    });

    return projects ?? [];
  }

  async fetchProject(projectId: string) {
    const project = await this.projectRepository.findOne({
      where: {
        projectId: projectId,
      },
      relations: ['industry'],
    });
    if (!project) {
      throw new NotFoundException(' NO SUCH PROJECT FOUND !');
    }
    return project;
  }

  async deleteProject(projectId: string) {
    const project = await this.projectRepository.findOne({
      where: {
        projectId: projectId,
      },
      relations: ['industry'],
    });
    if (!project) {
      throw new NotFoundException(' NO SUCH PROJECT FOUND !');
    }

    await this.projectRepository.delete({
      projectId: projectId,
    });

    return {
      status: 'Success',
      message: 'project deleted !!',
    };
  }

  async fetchProjectsForOwner(userId: string) {
    const projects = await this.projectRepository.find({
      where: {
        projectOwner: <any>{ userId: userId },
      },
      relations: ['contributerInProjects', 'industry'],
    });
    return projects;
  }

  async fetchProjectsForContributer(userId: string) {
    const projects = await this.projectRepository.find({
      relations: ['contributerInProjects', 'industry'],
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
      relations: ['likedBy', 'industry', 'projectOwner', 'projectOwner.skills'],
      where: {
        likedBy: { userId },
      },
    });
    return projects ?? [];
  }

  async searchProjects(searchProjectsDto: SearchProjectsDto) {
    const { industries, stages, categories } = searchProjectsDto;

    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.industry', 'industry');

    if (industries && industries.length) {
      const subQuery = this.projectRepository
        .createQueryBuilder('subquery')
        .leftJoin('subquery.industry', 'industry')
        .where('industry.name IN (:...industries)', { industries })
        .select('DISTINCT(subquery.id)');

      queryBuilder.andWhere(`project.id IN (${subQuery.getQuery()})`);
      queryBuilder.setParameters(subQuery.getParameters());
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
