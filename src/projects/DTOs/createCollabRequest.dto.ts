import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollabRequestDTO {
  @IsNotEmpty({ message: 'Please provide a message to visionary.' })
  @IsString({
    message:
      'Invalid request message format. request message must be a string.',
  })
  @ApiProperty({
    description: 'request message for a specific project.',
  })
  requestMessage: string;

  @IsNotEmpty({
    message: 'Please provide project for the request to be sent to.',
  })
  @IsString({
    message: 'project Id invalid. please provide as string.',
  })
  @ApiProperty({
    description: 'id of the project that the request is associated to.',
  })
  projectId: string;
}
