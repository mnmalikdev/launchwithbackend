import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from 'src/auth/0auth2.0/entites/user.entity';
import { AddSkillDTO } from '../DTOS/addSkill.dto';
import { AssignRoleDTO } from '../DTOS/assignRole.dto';
import { UpdateProfileDTO } from '../DTOS/updateProfile.dto';
import { Skill } from '../entities/skills.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
    @InjectRepository(Skill) public skillRepository: Repository<Skill>,
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

  async assignRole(userId: string, roleDto: AssignRoleDTO) {
    const user = await this.getUserById(userId);
    user.role = roleDto.role;

    await this.userRepository.save(user);
  }

  async addSkills(userId: string, addSkillDto: AddSkillDTO) {
    console.log(addSkillDto);
    const user = await this.userRepository.findOne({
      where: {
        userId: userId,
      },
      relations: ['skills'],
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const skillEntities = addSkillDto.skills.map((skill) => {
      const skillEntity = new Skill();
      skillEntity.category = skill.category;
      skillEntity.subcategory = skill.subcategory;
      skillEntity.skillForUser = user;
      return skillEntity;
    });
    return await this.skillRepository.save(skillEntities);
  }

  async updateUserProfile(userId: string, updateProfileDto: UpdateProfileDTO) {
    const user = await this.getUserById(userId);

    if (updateProfileDto.firstName) {
      user.firstName = updateProfileDto.firstName;
    }

    if (updateProfileDto.lastName) {
      user.lastName = updateProfileDto.lastName;
    }

    if (updateProfileDto.major) {
      user.major = updateProfileDto.major;
    }

    if (updateProfileDto.position) {
      user.position = updateProfileDto.position;
    }

    if (updateProfileDto.bio) {
      user.bio = updateProfileDto.bio;
    }

    await this.userRepository.save(user);

    return user;
  }
}
