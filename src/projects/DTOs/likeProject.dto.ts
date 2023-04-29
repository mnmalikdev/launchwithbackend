import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LikeProjectDTO {
  @IsNotEmpty({ message: 'Please provide a valid project id' })
  @IsString({
    message: 'Invalid project id. project ids  must be valid string',
  })
  @ApiProperty({
    description: 'project id',
  })
  projectId: string;
}
