// collab-request.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/0auth2.0/entites/user.entity';

import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Project } from './projects.entity';

@Entity()
export class CollabRequest {
  @ApiProperty({
    description: 'unique id of the collab request',
  })
  @PrimaryColumn()
  collabRequestId: string;

  @ApiProperty({
    description: 'a message from the potential collaborator/contributer',
  })
  @Column({
    length: 1500,
  })
  requestMessage: string;

  @ApiProperty({
    description: 'provide user Id associate',
  })
  @ManyToOne(() => User, (user) => user.collabRequestSender, {
    onDelete: 'CASCADE',
  })
  collabRequestedBy: User;

  @ApiProperty({
    description: 'provide project Id to associate',
  })
  @ManyToOne(() => Project, (project) => project.collabRequests, {
    onDelete: 'CASCADE',
  })
  projectAssociatedWith: Project;
}
