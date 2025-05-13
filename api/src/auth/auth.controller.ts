import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from 'src/refresh-token/dto/refresh_token.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GetUser } from '@common/decorators/get-users.decorator';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge:
        parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_SECONDS || '604800') *
        1000,
      path: '/',
    });

    return { access_token };
  }

  @Post('/refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {

    const refreshToken = req.cookies?.refreshToken;

    const refreshTokenData = plainToInstance(RefreshTokenDto, { refreshToken });
    const errors = await validate(refreshTokenData);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid Refresh token format');
    }

    try {
      const { access_token, refresh_token: newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      // Actualizar Refresh Token cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge:
          parseInt(
            process.env.JWT_REFRESH_TOKEN_EXPIRATION_SECONDS || '604800',
          ) * 1000,
        path: '/auth/refresh',
      });

      return { access_token };
    } catch (error) {
      res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        expires: new Date(0), // Expira inmediatamente
      });

      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/logout')
  async logout(
    @GetUser() user: AuthenticatedUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new BadRequestException('Refresh token not found');
    }

    await this.authService.logout(refreshToken, user.userId);

    // Limpiar solo la cookie del Refresh Token
    res.clearCookie('refreshToken', { path: '/' });

    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: AuthenticatedUser) {
    return user;
  }
}
