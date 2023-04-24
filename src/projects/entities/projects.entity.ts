import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Category, Industry, ProjectStage } from '../enums';

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
  @Column()
  basicInfo: string;

  @ApiProperty({
    description: 'basic details about project',
  })
  @Column()
  moreInfo: string;

  @ApiProperty({
    description: 'Industry that the project focuses on',
  })
  @Column({
    type: 'enum',
    enum: Industry,
    default: Industry.WebProgrammingAppDesign,
  })
  industry: Industry;

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
  @Column({})
  companyUrl: string;

  // @ManyToOne(() => User, (user) => user.skills)
  // skillForUser: User;
}
