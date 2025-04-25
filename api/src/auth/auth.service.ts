import { Injectable , UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    passwordPlainText: string,
  ): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    if(!user) {
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
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
