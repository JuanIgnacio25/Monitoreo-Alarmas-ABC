import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(userDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(userDto.email);

    if (existingUser) {
      throw new ConflictException(
        `User with email ${userDto.email} already exists`,
      );
    }

    const hashedPassword = await this.hashPassword(userDto.password);
    const user = {
      ...userDto,
      password: hashedPassword,
    };
    const createdUser = await this.userRepository.create(user);

    return new UserResponseDto(
      createdUser.id,
      createdUser.email,
      createdUser.address,
      createdUser.phone,
      createdUser.address,
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(
      (user) =>
        new UserResponseDto(
          user.id,
          user.email,
          user.role,
          user.phone,
          user.address,
        ),
    );
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne(id);

    if(!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return new UserResponseDto(user.id,user.email,user.phone,user.role,user.address);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findByEmail(email);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  updateIdReferenceRefreshToken(id: number, refreshTokenId: number | null) {
    return this.userRepository.updateIdReferenceRefreshToken(
      id,
      refreshTokenId,
    );
  }

  async remove(id: number) {
    return await this.userRepository.remove(id);
  }
}
