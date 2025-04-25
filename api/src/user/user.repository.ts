import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

interface UserDataFromDatabase {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    const findedUsers = await this.prismaService.user.findMany();
    return findedUsers.map((usr) => this.mapToEntity(usr));
  }

  async findOne(id: number): Promise<User | undefined>  {
    const findedUser = await this.prismaService.user.findUnique({
      where: {
        id
      }
    })

    if(!findedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToEntity(findedUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const findedUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!findedUser) {
      return undefined;
    }

    return this.mapToEntity(findedUser);
  }
  

  async create(user: CreateUserDto): Promise<User> {
    const createdUser = await this.prismaService.user.create({
      data: user,
    });
    return this.mapToEntity(createdUser);
  }

  async remove(id: number) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  private mapToEntity(userData: UserDataFromDatabase): User {
    const user = new User();
    user.id = userData.id;
    user.email = userData.email;
    user.password = userData.password;
    return user;
  }
}
