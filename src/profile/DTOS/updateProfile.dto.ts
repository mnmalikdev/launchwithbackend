import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @IsOptional()
  @IsString({ message: 'Invalid firstName format ! please provide as string' })
  @ApiProperty({
    description: 'firstname',
    example: 'John',
  })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Invalid lastname format ! please provide as string' })
  @ApiProperty({
    description: 'last name',
    example: 'Dorian',
  })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Invalid Major format ! provide as string' })
  @ApiProperty({
    description: 'major of studies. e.g medicine with major in psychiatry',
    example: 'Psychiatry',
  })
  major?: string;

  @IsOptional()
  @IsString({ message: 'Invalid position format ! provide as string' })
  @ApiProperty({
    description:
      'designation at organization. could be resaerch assitan for example',
    example: 'research associate',
  })
  position?: string;

  @IsOptional()
  @IsString({ message: 'Invalid bio/intro format ! provide as string' })
  @ApiProperty({
    description: 'a brief introduction of the user.',
    example: 'i am someone , with experience in neuro-science',
  })
  bio?: string;
}
