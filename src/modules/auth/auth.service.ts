import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { UsersService } from '../users/users.service';
import { HashingService } from '../hashing/hashing.service';
import { User } from '@prisma/client';
import { RefreshTokensService } from '../refreshTokens/refresh-tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private refreshTokensService: RefreshTokensService,
    private passwordService: HashingService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: User) {
    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.refreshTokensService.generateToken(user.id);
    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      const isPasswordValid = await this.passwordService.compare(
        password,
        user.password,
      );

      if (isPasswordValid) {
        return user;
      }
    }

    return null;
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.findOneByEmail(signUpDto.email);

    if (user) {
      throw new Error('User already exists');
    }

    signUpDto.password = await this.passwordService.hash(signUpDto.password);

    const createdUser = await this.userService.create(signUpDto);
    return { id: createdUser.id };
  }

  async refreshToken(userId: string) {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async logOut(refreshToken: string) {
    await this.refreshTokensService.revokeToken(refreshToken);
  }

  async revokeAllTokens(userId: string) {
    await this.refreshTokensService.revokeAllTokens(userId);
  }
}
