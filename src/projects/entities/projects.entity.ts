import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/0auth2.0/entites/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category, ProjectStage } from '../enums';
import { Industry } from './industry.entity';
@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'unique id of project',
  })
  @Column()
  projectId: string;

  @ApiProperty({
    description: 'project name',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'basic details about project',
  })
  @Column({
    length: 1200,
  })
  basicInfo: string;

  @ApiProperty({
    description: 'basic details about project',
  })
  @Column({
    length: 1200,
  })
  moreInfo: string;

  @ApiProperty({
    description: 'Start Date of the project',
  })
  @Column()
  startDate: number;

  @ManyToMany(() => Industry, (industry) => industry.belongsToProject, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  industry: Industry[];

  @ApiProperty({
    description: 'specific category that defines scope of work',
  })
  @Column({
    type: 'enum',
    enum: Category,
    default: Category.FullStackDevelopment,
  })
  category: Category;

  @ApiProperty({
    description: 'Current stage of the project',
  })
  @Column({
    type: 'enum',
    enum: ProjectStage,
    default: ProjectStage.IdeaConcept,
  })
  stage: ProjectStage;

  @ApiProperty({
    description: 'company website url if any',
  })
  @Column()
  companyUrl: string;

  @ManyToOne(() => User, (user) => user.ownerInProject, {
    onDelete: 'CASCADE',
  })
  projectOwner: User;

  @ManyToMany(() => User, (user) => user.contributerInProject, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  contributerInProjects: User[];

  @ManyToMany(() => User, (user) => user.likedProjects, {
    onDelete: 'CASCADE',
  })
  likedBy: User[];
}
