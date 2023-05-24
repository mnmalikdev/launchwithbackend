import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Request } from 'express';
import { User } from 'src/auth/0auth2.0/entites/user.entity';
import { UploadFileDTO } from 'src/google-cloud/DTOs/uploadFile.dto';
import { AddSkillDTO } from '../DTOS/addSkill.dto';
import { AssignRoleDTO } from '../DTOS/assignRole.dto';
import { UpdateProfileDTO } from '../DTOS/updateProfile.dto';
import { ProfileService } from '../services/profile.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/assignRole')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a  role in the DB for a specific user' })
  async assignRole(@Req() req: Request, @Body() roleDto: AssignRoleDTO) {
    console.log(req.user);
    return await this.profileService.assignRole(req.user['sub'], roleDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/addSkills')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add Skills for a user' })
  @ApiBody({
    description: 'dto for uploading skills',
    type: AddSkillDTO,
  })
  @ApiOkResponse({
    type: AddSkillDTO,
  })
  async addSkills(@Req() req: Request, @Body() addSkillDto: AddSkillDTO) {
    return await this.profileService.addSkills(req.user['sub'], addSkillDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/fetchProfile/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'returns specific project' })
  async fetchProfile(@Param('userId') userId: string) {
    return await this.profileService.fetchUserProfile(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/deletePortfolioSample/:url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletes the url from user portfolio url' })
  async deletePortfolioUrl(@Req() req: Request, @Param('url') url: string) {
    return await this.profileService.deltePortfolioUrl(req.user['sub'], url);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/uploadProfilePic')
  @ApiBody({
    description: 'dto and image file for upload',
    type: UploadFileDTO,
  })
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'add contributer to a project' })
  @UseInterceptors(FileInterceptor('profilePic'))
  async uploadFile(@Req() req: Request, @UploadedFile() profilePic: any) {
    return await this.profileService.uploadProfileImage(
      req.user['sub'],
      profilePic,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/uploadCoverPic')
  @ApiBody({
    description: 'dto and image file for upload',
    type: UploadFileDTO,
  })
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'add contributer to a project' })
  @UseInterceptors(FileInterceptor('coverPic'))
  async uploadCoverFile(@Req() req: Request, @UploadedFile() coverPic: any) {
    return await this.profileService.uploadCoverImage(
      req.user['sub'],
      coverPic,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @Patch('/updateProfile')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'portfolio', maxCount: 3 }]))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint to update a user info' })
  @ApiBody({
    description: 'dto for uploading skills',
    type: UpdateProfileDTO,
  })
  @ApiOkResponse({
    type: User,
  })
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDTO,
    @UploadedFiles()
    files: {
      portfolio?: any[];
    },
  ) {
    return await this.profileService.updateUserProfile(
      req.user['sub'],
      updateProfileDto,
      files,
    );
  }
}
