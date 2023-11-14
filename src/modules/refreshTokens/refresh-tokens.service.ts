import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokensService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService<IEnvVariables>,
  ) {}

  async generateToken(userId: string) {
    await this.removeAllExpiredTokens(userId);

    const payload = { sub: userId };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
      },
    });

    return token;
  }

  async validateToken(token: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    return tokenRecord || null;
  }

  async revokeToken(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
      },
    });
  }

  async revokeAllTokens(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async removeAllExpiredTokens(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        createdAt: {
          lt: new Date(
            new Date().getTime() -
              this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
          ),
        },
      },
    });
  }
}
