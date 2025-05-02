import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RefreshToken } from './entities/refreshToken.entity';
import { RefreshTokenInterface } from './interfaces/refresh-token.interface';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    token: string;
    userId: number;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    const createdRefreshToken = await this.prisma.refreshToken.create({ data });
    return this.mapToEntity(createdRefreshToken);
  }

  async findOne(token: string): Promise<RefreshToken | null> {
    const findedRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!findedRefreshToken) return null;
    return this.mapToEntity(findedRefreshToken);
  }

  async findByUserId(userId: number): Promise<RefreshToken | null> {
    const findedRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { userId },
    });
    if (!findedRefreshToken) return null;
    return this.mapToEntity(findedRefreshToken);
  }

  async updateByUserId(
    userId: number,
    data: { token: string; expiresAt: Date },
  ): Promise<RefreshToken> {
    const updatedRefreshToken = await this.prisma.refreshToken.update({
      where: { userId },
      data,
    });

    return this.mapToEntity(updatedRefreshToken);
  }

  async deleteByUserId(userId: number): Promise<RefreshToken | null> {
    const deletedRefreshToken = await this.prisma.refreshToken.delete({
      where: { userId },
    });
    return this.mapToEntity(deletedRefreshToken);
  }

  private mapToEntity(refreshTokenData: RefreshTokenInterface): RefreshToken {
    const refreshToken = new RefreshToken();
    refreshToken.id = refreshTokenData.id;
    refreshToken.token = refreshTokenData.token;
    refreshToken.userId = refreshTokenData.userId;
    refreshToken.createdAt = refreshTokenData.createdAt;
    refreshToken.expiresAt = refreshTokenData.expiresAt;
    return refreshToken;
  }
}
