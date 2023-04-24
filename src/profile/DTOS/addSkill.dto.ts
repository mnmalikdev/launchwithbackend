import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class SkillDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The skill category',
    example: 'Programming/Tech',
  })
  category: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The skill subcategory',
    example: 'Cybersecurity & Data Protection',
  })
  subcategory: string;
}

// @IsNotEmpty({ message: 'Please provide list of circuits' })
// @ApiProperty({
//   description: 'Circuits in Workout',
//   type: [CircuitDTOType],
// })
// @Type(() => CircuitDTOType)
// @ValidateNested()
// circuits: CircuitDTOType[];

export class AddSkillDTO {
  @IsNotEmpty({ message: 'Please provide list of skills' })
  @ApiProperty({
    description: 'Array of skills to add',
    type: [SkillDTO],
  })
  @Type(() => SkillDTO)
  @ValidateNested()
  skills: SkillDTO[];
}
