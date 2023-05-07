import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDTO {
  @ApiProperty({
    description: 'Image file as jpeg or png ',
    format: 'binary',
    type: 'string',
    required: true,
  })
  profilePic: any;
}
