// AddContributorDto
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddContributorDto {
  @ApiProperty({
    description: 'The userId of the user to add as a contributor',
  })
  @IsNotEmpty({ message: 'User Id is required' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The ID of the project to add the contributor to',
  })
  @IsNotEmpty({ message: 'Project ID is required' })
  @IsString({ message: 'Invalid project ID' })
  projectId: string;
}
