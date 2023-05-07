import { ApiProperty } from '@nestjs/swagger';

export class UploadCoverPicDTO {
  @ApiProperty({
    description: 'Image file as jpeg or png ',
    format: 'binary',
    type: 'string',
    required: true,
  })
  coverPic: any;
}
