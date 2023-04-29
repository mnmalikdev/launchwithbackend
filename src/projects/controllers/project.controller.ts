import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBody, ApiOperation } from '@nestjs/swagger';

import { Request } from 'express';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { CreateProjectDTO } from '../DTOs/createProject.dto';
import { LikeProjectDTO } from '../DTOs/likeProject.dto';
import { ProjectsService } from '../services/projects.service';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/createProject')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a project for a project owner' })
  @ApiBody({
    type: CreateProjectDTO,
  })
  async createProject(
    @Req() req: Request,
    @Body() createProjectDto: CreateProjectDTO,
  ) {
    return await this.projectService.createProject(
      req.user['sub'],
      createProjectDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/fetchAllProjects')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'returns all projects created' })
  async fetchAllProjects() {
    return await this.projectService.fetchAllProjects();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/fetchProject/:projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'returns specific project' })
  async fetchProject(@Param('projectId') projectId: string) {
    return await this.projectService.fetchProject(projectId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/fetchOwnerProjects')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'returns owner projects' })
  async fetchOwnerProjects(@Req() req: Request) {
    return await this.projectService.fetchProjectsForOwner(req.user['sub']);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/fetchContributerProjects')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'returns contributer projects' })
  async fetchContributerProjects(@Req() req: Request) {
    return await this.projectService.fetchProjectsForContributer(
      req.user['sub'],
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/likeProject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'likes a project for a specific user' })
  async likeProject(
    @Req() req: Request,
    @Body() likeProjectDto: LikeProjectDTO,
  ) {
    return await this.projectService.likeProject(
      req.user['sub'],
      likeProjectDto.projectId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/unlikeProject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'unlikes a project for a specific user' })
  async unlikeProject(
    @Req() req: Request,
    @Body() likeProjectDto: LikeProjectDTO,
  ) {
    return await this.projectService.unlikeProject(
      req.user['sub'],
      likeProjectDto.projectId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/fetchLikedProjects')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'returns liked projects of a user' })
  async fetchLikedProjects(@Req() req: Request) {
    return await this.projectService.fetchLikedProjects(req.user['sub']);
  }
}
