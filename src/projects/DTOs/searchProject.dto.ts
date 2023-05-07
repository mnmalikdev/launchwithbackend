import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class SearchProjectsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Industries to filter by',
    isArray: true,
    type: String,
  })
  industries?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Stages to filter by',
    isArray: true,
    type: String,
  })
  stages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Categories to filter by',
    isArray: true,
    type: String,
  })
  categories?: string[];
}
