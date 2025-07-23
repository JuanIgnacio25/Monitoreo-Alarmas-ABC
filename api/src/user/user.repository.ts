import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    const findedUsers = await this.prismaService.user.findMany();
    return findedUsers.map((usr) => new User(usr));
  }

  async findOne(id: number): Promise<User | undefined> {
    const findedUser = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!findedUser) {
      return undefined;
    }

    return new User(findedUser);
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

    return new User(findedUser);
  }

  async create(user: CreateUserDto): Promise<User> {
    const createdUser = await this.prismaService.user.create({
      data: user,
    });
    return new User(createdUser);
  }

  async remove(id: number) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async updateIdReferenceRefreshToken(
    id: number,
    refreshTokenId: number | null,
  ) {
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { refreshTokenId },
    });

    return new User(updatedUser);
  }
}
