import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensService } from '../../refreshTokens/refresh-tokens.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private refreshTokensService: RefreshTokensService,
    private configService: ConfigService<IEnvVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: IRequest, payload) {
    const refreshToken = req.headers.authorization
      .replace('Bearer', '')
      ?.trim();
    const token = await this.refreshTokensService.validateToken(refreshToken);

    if (!token) {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    return { id: payload.sub };
  }
}
