import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from 'src/auth/0auth2.0/entites/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
  ) {}

  async getUserById(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        userId: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('NO SUCH USER FOUND !');
    }
    return user;
  }
}
