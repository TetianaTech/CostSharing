import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { Public } from 'src/decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    const { accessToken } = await this.authService.refreshToken(req.user.id);
    return { accessToken };
  }

  @Post('log-out')
  @HttpCode(HttpStatus.OK)
  async logOut(@Request() req) {
    const refreshToken = req.headers.authorization
      .replace('Bearer', '')
      ?.trim();
    await this.authService.logOut(refreshToken);
  }

  @Post('revoke-tokens')
  @HttpCode(HttpStatus.OK)
  async revokeAll(@Request() req) {
    await this.authService.revokeAllTokens(req.user.id);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
