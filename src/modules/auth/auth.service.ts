import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOneWithEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordCorrect = await this.passwordService.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.findOneWithEmail(signUpDto.email);

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
