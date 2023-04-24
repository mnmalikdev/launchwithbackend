import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/auth/0auth2.0/enums';

export class AssignRoleDTO {
  @IsNotEmpty({ message: 'Please provide a valid role' })
  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}
