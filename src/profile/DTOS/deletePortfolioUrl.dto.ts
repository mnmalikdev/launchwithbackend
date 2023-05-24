import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePortfolioUrlDTO {
  @IsNotEmpty({ message: 'Please provide a valid role' })
  @IsString()
  @ApiProperty({
    description: 'exact url of the portfolio sample',
  })
  url: string;
}
