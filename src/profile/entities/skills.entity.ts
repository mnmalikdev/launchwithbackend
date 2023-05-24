import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './../../auth/0auth2.0/entites/user.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'category of the skill',
  })
  @Column()
  category: string;

  @ApiProperty({
    description: 'subcategory of the skill',
  })
  @Column()
  subcategory: string;

  @ManyToOne(() => User, (user) => user.skills, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  skillForUser: User;
}
