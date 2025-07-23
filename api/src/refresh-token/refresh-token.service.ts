import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { add } from 'date-fns';
import { RefreshToken } from './entities/refreshToken.entity';


@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateRefreshToken(userId: number, expiresInDays: number = 7): Promise<string> {
    const token = uuidv4();
    //Hashear el token generado con uuid
    const hashedToken = this.hashToken(token);

    const expiresAt = add(new Date(), { days: expiresInDays });

    const existingToken = await this.refreshTokenRepository.findByUserId(userId);

    //Si el refreshToken ya existe actualiza el token y el expiresAt, en la base de datos guarda el token hasheado 
    if (existingToken) {
      await this.refreshTokenRepository.updateByUserId(userId, { token: hashedToken, expiresAt });
      return token;
    }

    await this.refreshTokenRepository.create({ token: hashedToken, userId, expiresAt });

    //devuelve el token sin hashear
    return token;
  }

  private hashToken(token: string){
    return createHash('sha256').update(token).digest('hex');
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    const hashedToken = this.hashToken(token);

    return this.refreshTokenRepository.findOne(hashedToken);
  }

  async findTokenByUserId(userId: number): Promise<number | null> {
    const refreshTokenData = await this.refreshTokenRepository.findByUserId(userId);
    return refreshTokenData ? refreshTokenData.id : null;
  }

  async verifyRefreshToken(token: string): Promise<RefreshToken | null> {
    const refreshTokenData = await this.findRefreshToken(token);
    if (!refreshTokenData || new Date() > refreshTokenData.expiresAt) {
      return null;
    }
    return refreshTokenData;
  }

  async generateAccessToken(userId: number, email: string, role?: string): Promise<string> {
    const payload = { sub: userId, email, role };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION') || '15m',
    });
  }

  async revokeRefreshTokenForUser(userId: number): Promise<void> {
    await this.refreshTokenRepository.deleteByUserId(userId);
  }
}