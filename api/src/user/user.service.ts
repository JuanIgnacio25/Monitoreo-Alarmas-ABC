import {Injectable, ConflictException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userDto.email);

    if (existingUser) {
      throw new ConflictException(`User with email ${userDto.email} already exists`)
    }

    const hashedPassword = await this.hashPassword(userDto.password);
    const user = {
      ...userDto,
      password: hashedPassword,
    };
    const createdUser = await this.userRepository.create(user);

    return createdUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  updateIdReferenceRefreshToken(id: number, refreshTokenId: number | null) {
    return this.userRepository.updateIdReferenceRefreshToken(id, refreshTokenId);
  }

  async remove(id: number) {
    return await this.userRepository.remove(id);
  }
}
