import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Category, ProjectStage } from '../enums';

export class EditProjectDTO {
  @IsOptional()
  @IsString({
    message: 'Invalid project name. Project name must be a valid string',
  })
  @ApiProperty({
    description: 'Project name',
    example: 'Project Name',
    required: false,
  })
  name?: string;

  //  more fields

  @IsOptional()
  @IsString({
    message:
      'Invalid basic information. Basic information must be a valid string',
  })
  @ApiProperty({
    description: 'Basic information about the project',
    example: 'This is a brief summary of my project',
    required: false,
  })
  basicInfo?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Tentative project start date',
    required: false,
  })
  startDate?: number;

  @IsOptional()
  @IsString({
    message:
      'Invalid more information. More information must be a valid string',
  })
  @ApiProperty({
    description: 'More detailed information about the project',
    example: 'This is a more detailed description of my project',
    required: false,
  })
  moreInfo?: string;

  // todo: recheck after making separate tables
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Industry that the project focuses on',
    required: false,
  })
  industry?: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Specific category that defines the scope of work',
    enum: Category,
    example: Category.FullStackDevelopment,
    required: false,
  })
  category?: Category;

  @IsOptional()
  @ApiProperty({
    description: 'Current stage of the project',
    enum: ProjectStage,
    example: ProjectStage.IdeaConcept,
    required: false,
  })
  stage?: ProjectStage;

  @IsOptional()
  @IsString({
    message: 'Invalid company URL. Must be a valid string',
  })
  @ApiProperty({
    description: 'Company website URL if any',
    example: 'https://example.com',
    required: false,
  })
  companyUrl?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Contributor user IDs',
    required: false,
  })
  contributorUserIds?: string[];
}
