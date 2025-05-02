import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { PrismaService } from 'src/prisma.service';

import { UserRepository } from 'src/user/user.repository';
import { AuthController } from './auth.controller';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenRepository } from 'src/refresh-token/refresh-token.repository';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    RefreshTokenService,
    RefreshTokenRepository,
    PrismaService,
    LocalStrategy,
    JwtStrategy
  ],
})
export class AuthModule {}
