import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { NODE_ENV } from './constants/nodeEnv.contsants';

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
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
