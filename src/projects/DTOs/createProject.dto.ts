import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category, ProjectStage } from '../enums';

export class CreateProjectDTO {
  @IsNotEmpty({ message: 'Please provide a valid project name' })
  @IsString({
    message: 'Invalid project names. project names  must be valid string',
  })
  @ApiProperty({
    description: 'project name',
    example: 'project name',
  })
  name: string;

  //  more fields

  @IsNotEmpty({ message: 'Please provide basic information about the project' })
  @IsString({
    message:
      'Invalid basic information. Basic information must be a valid string',
  })
  @ApiProperty({
    description: 'Basic information about the project',
    example: 'This is a brief summary of my project',
  })
  basicInfo: string;

  @IsNumber()
  @ApiProperty({
    description: 'tentative proejct start date.',
  })
  startDate?: number;

  @IsNotEmpty({ message: 'Please provide more information about the project' })
  @IsString({
    message:
      'Invalid more information. More information must be a valid string',
  })
  @ApiProperty({
    description: 'More detailed information about the project',
    example: 'This is a more detailed description of my project',
  })
  moreInfo: string;

  // todo : recheck after making seperate tables
  @IsNotEmpty({ message: 'Please provide industry ' })
  @IsArray()
  @ApiProperty({
    description: 'Industry that the project focuses on',
  })
  industry: string[];

  @IsNotEmpty({ message: 'Please choose category for project ' })
  @ApiProperty({
    description: 'Specific category that defines scope of work',
    enum: Category,
    example: Category.FullStackDevelopment,
  })
  category: Category;

  @IsNotEmpty({ message: 'Please choose a valid stage for project ' })
  @ApiProperty({
    description: 'Current stage of the project',
    enum: ProjectStage,
    example: ProjectStage.IdeaConcept,
  })
  stage: ProjectStage;

  @IsOptional()
  @IsString({
    message: 'Invalid company url.  must be a valid string',
  })
  @ApiProperty({
    description: 'Company website URL if any',
    example: 'https://example.com',
  })
  companyUrl?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  contributerUserIds?: string[];
}
