// AddContributorDto
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Industries } from '../enums';

export class AddIndustryDTO {
  @ApiProperty({
    description: 'name of the industry',
  })
  @IsNotEmpty({ message: 'name of industry is required' })
  @IsString()
  industryName: Industries;

  @ApiProperty({
    description: 'The ID of the project to add the industry to',
  })
  @IsNotEmpty({ message: 'Project ID is required' })
  @IsString({ message: 'Invalid project ID' })
  projectId: string;
}
