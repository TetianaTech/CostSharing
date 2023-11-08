import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { UsersService } from '../users/users.service';
import { PasswordHashingService } from '../passwordHashing/passwordHashing.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private passwordService: PasswordHashingService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: User) {
    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      const isPasswordValid = await this.passwordService.comparePassword(
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

    signUpDto.password = await this.passwordService.hashPassword(
      signUpDto.password,
    );

    const createdUser = await this.userService.create(signUpDto);
    return { id: createdUser.id };
  }
}
