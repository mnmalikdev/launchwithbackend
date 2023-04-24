import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Request } from 'express';
import { User } from 'src/auth/0auth2.0/entites/user.entity';
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
  @Patch('/updateProfile')
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
  ) {
    return await this.profileService.updateUserProfile(
      req.user['sub'],
      updateProfileDto,
    );
  }
}
