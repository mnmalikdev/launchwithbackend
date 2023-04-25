import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBody, ApiOperation } from '@nestjs/swagger';

import { Request } from 'express';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { CreateProjectDTO } from '../DTOs/createProject.dto';
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
}
