import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Project } from './projects.entity';

@Entity()
export class Industry {
  @ApiProperty({
    description: 'Industry id of the industry',
  })
  @PrimaryColumn()
  industryId: string;

  @ApiProperty({
    description: 'name of industry',
  })
  @Column()
  name: string;

  @ManyToMany(() => Project, (project) => project.industry)
  @JoinTable()
  belongsToProject: Project;
}
