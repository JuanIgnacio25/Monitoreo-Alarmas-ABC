import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RefreshToken } from './entities/refreshToken.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    token: string;
    userId: number;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    const createdRefreshToken = await this.prisma.refreshToken.create({ data });
    return new RefreshToken(createdRefreshToken);
  }

  async findOne(token: string): Promise<RefreshToken | null> {
    const findedRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!findedRefreshToken) return null;
    return new RefreshToken(findedRefreshToken);
  }

  async findByUserId(userId: number): Promise<RefreshToken | null> {
    const findedRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { userId },
    });
    if (!findedRefreshToken) return null;
    return new RefreshToken(findedRefreshToken);
  }

  async updateByUserId(
    userId: number,
    data: { token: string; expiresAt: Date },
  ): Promise<RefreshToken> {
    const updatedRefreshToken = await this.prisma.refreshToken.update({
      where: { userId },
      data,
    });

    return new RefreshToken(updatedRefreshToken);
  }

  async deleteByUserId(userId: number): Promise<RefreshToken | null> {
    const deletedRefreshToken = await this.prisma.refreshToken.delete({
      where: { userId },
    });
    return new RefreshToken(deletedRefreshToken);
  }

}
