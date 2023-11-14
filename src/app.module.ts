import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { NODE_ENV } from './constants/nodeEnv.contsants';
import { RefreshTokensModule } from './modules/refreshTokens/refresh-tokens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string()
          .valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION)
          .default(NODE_ENV.DEVELOPMENT),
        DATABASE_URL: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().default(3600),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().default(604800),
      }),
    }),
    AuthModule,
    UsersModule,
    RefreshTokensModule,
  ],
})
export class AppModule {}
