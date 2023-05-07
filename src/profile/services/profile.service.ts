import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from 'src/auth/0auth2.0/entites/user.entity';
import { GoogleDriveService } from 'src/google-cloud/google-cloud.service';
import { AddSkillDTO } from '../DTOS/addSkill.dto';
import { AssignRoleDTO } from '../DTOS/assignRole.dto';
import { UpdateProfileDTO } from '../DTOS/updateProfile.dto';
import { Skill } from '../entities/skills.entity';
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
    @InjectRepository(Skill) public skillRepository: Repository<Skill>,
    private readonly googleDriveService: GoogleDriveService,
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
    console.log(userId);
    console.log(roleDto);
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

    // Remove duplicate skill entities
    const uniqueSkillEntities = skillEntities.filter(
      (skillEntity, index, self) => {
        const foundIndex = self.findIndex(
          (s) =>
            s.category === skillEntity.category &&
            s.subcategory === skillEntity.subcategory,
        );
        return index === foundIndex;
      },
    );

    return await this.skillRepository.save(uniqueSkillEntities);
  }

  async updateUserProfile(
    userId: string,
    updateProfileDto: UpdateProfileDTO,
    files?: any,
  ) {
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

    const existingPortfolioArray = JSON.parse(user?.portfolioUrls);

    if (existingPortfolioArray?.length > 3) {
      throw new BadRequestException('only three samples of portfolio allowed');
    } else {
      for (let i = 0; i < files?.portfolio?.length; i++) {
        const file = files.portfolio[i];
        const url = await this.googleDriveService.uploadFile(
          file,
          '1fxgvSIrudEQxG2rl8FTbMDQoRbi2QvAO',
        );
        existingPortfolioArray.push(url);
      }
    }
    // loop over files array

    const arrayInString = JSON.stringify(existingPortfolioArray);
    user.portfolioUrls = arrayInString;

    await this.userRepository.save(user);

    return user;
  }

  async uploadProfileImage(userId: string, file: any) {
    console.log(file);
    const user = await this.getUserById(userId);

    const url = await this.googleDriveService.uploadFile(
      file,
      '1fxgvSIrudEQxG2rl8FTbMDQoRbi2QvAO',
    );
    user.profileImageUrl = url;
    await this.userRepository.save(user);

    return user;
  }

  async uploadCoverImage(userId: string, file: any) {
    console.log(file);
    const user = await this.getUserById(userId);

    const url = await this.googleDriveService.uploadFile(
      file,
      '1fxgvSIrudEQxG2rl8FTbMDQoRbi2QvAO',
    );
    user.coverImageUrl = url;
    await this.userRepository.save(user);

    return user;
  }

  async fetchUserProfile(userId: string) {
    let user = await this.userRepository.findOne({
      where: {
        userId: userId,
      },
      relations: ['skills'],
    });
    if (!user) {
      throw new NotFoundException('NO SUCH USER FOUND');
    }
    // parse the user portfolio links before returning it.
    const portfolioUrls = JSON.parse(user.portfolioUrls);
    // return by embedding in the user object again
    user.portfolioUrls = portfolioUrls;
    // remove duplicates in skills form the skills array.
    const uniqueSkills = user.skills.reduce((acc, skill) => {
      const foundSkill = acc.find(
        (s) =>
          s.category === skill.category && s.subcategory === skill.subcategory,
      );
      if (!foundSkill) {
        acc.push(skill);
      }
      return acc;
    }, []);
    user.skills = uniqueSkills;
    // save the updated user object

    // return the updated user object
    return user;
  }

  async deltePortfolioUrl(userId: string, portfolioUrl: string) {
    console.log(portfolioUrl);
    const user = await this.userRepository.findOne({
      where: {
        userId: userId,
      },
    });
    const portfolioUrls = JSON.parse(user.portfolioUrls);

    // delete portfolioUrl from portfolioUrls.
    const filteredPortfolioUrls = portfolioUrls.filter(
      (url) => url !== portfolioUrl,
    );
    user.portfolioUrls = JSON.stringify(filteredPortfolioUrls);
    // save the updated user object
    await this.userRepository.save(user);
    // return the updated user object
    return user;
  }
}
