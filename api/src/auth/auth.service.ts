import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

import { User } from 'src/user/entities/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(
    email: string,
    passwordPlainText: string,
  ): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const isPasswordValid = await bcrypt.compare(
      passwordPlainText,
      user.password,
    );

    if (isPasswordValid) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const accessToken = await this.refreshTokenService.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );
    const refreshToken = await this.refreshTokenService.generateRefreshToken(
      user.id,
    );

    // Actualiza la referencia del refreshToken en el modelo User
    const refreshTokenId = await this.refreshTokenService.findTokenByUserId(user.id);
    if (refreshTokenId) {
      await this.userService.updateIdReferenceRefreshToken(user.id, refreshTokenId);
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string) {
    const refreshTokenData =
      await this.refreshTokenService.verifyRefreshToken(token);
    if (!refreshTokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findOne(refreshTokenData.userId);
    if (!user) {
      throw new UnauthorizedException('User not found for refresh token');
    }

    const newAccessToken = await this.refreshTokenService.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );
    const newRefreshToken = await this.refreshTokenService.generateRefreshToken(
      user.id,
    );

    // Actualiza la referencia del refreshToken en el modelo User
    const refreshTokenId = await this.refreshTokenService.findTokenByUserId(user.id);
    if (refreshTokenId) {
      await this.userService.updateIdReferenceRefreshToken(user.id, refreshTokenId);
    }
    
    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(refreshToken: string, userId: number): Promise<void> {
    const refreshTokenData = await this.refreshTokenService.findRefreshToken(refreshToken);
    
    if(!refreshTokenData || refreshTokenData.userId !== userId) {
      throw new UnauthorizedException('invalid refresh token');
    } else {
      await this.refreshTokenService.revokeRefreshTokenForUser(refreshTokenData.userId);
      await this.userService.updateIdReferenceRefreshToken(refreshTokenData.userId, null);
    }
  }
}
