import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

import { Request } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UploadFileDTO } from 'src/google-cloud/DTOs/uploadFile.dto';
import { GoogleDriveService } from 'src/google-cloud/google-cloud.service';
import { AddContributorDto } from '../DTOs/addContributer.dto';
import { CreateProjectDTO } from '../DTOs/createProject.dto';
import { EditProjectDTO } from '../DTOs/editProject.dto';
import { LikeProjectDTO } from '../DTOs/likeProject.dto';
import { SearchProjectsDto } from '../DTOs/searchProject.dto';
import { ProjectsService } from '../services/projects.service';
@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

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
  @Delete('/deleteProject/:projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'deletes from db a specific project' })
  async deleteProject(@Param('projectId') projectId: string) {
    return await this.projectService.deleteProject(projectId);
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/addContributer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'add contributer to a project' })
  async addContributer(
    @Req() req: Request,
    @Body() addContributerDto: AddContributorDto,
  ) {
    return await this.projectService.addContributorToProject(addContributerDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/editProject/:projectId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'edit an existing project' })
  async editProject(
    @Param('projectId') projectId: string,
    @Body() editProjectDto: EditProjectDTO,
  ) {
    return await this.projectService.editProject(projectId, editProjectDto);
  }

  @Post('/testUpload')
  @ApiBody({
    description: 'dto and image file for upload',
    type: UploadFileDTO,
  })
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'add contributer to a project' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    const folderId = '1fxgvSIrudEQxG2rl8FTbMDQoRbi2QvAO';
    const url = await this.googleDriveService.uploadFile(file, folderId);
    return url;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/searchProjects')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'search projects based on some sort of filter.' })
  async searchProjects(
    @Req() req: Request,
    @Body() searchProjectsDto: SearchProjectsDto,
  ) {
    return await this.projectService.searchProjects(searchProjectsDto);
  }
}
