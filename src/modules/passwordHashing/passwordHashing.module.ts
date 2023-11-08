import { Module } from '@nestjs/common';
import { PasswordHashingService } from './passwordHashing.service';

@Module({
  providers: [PasswordHashingService],
  exports: [PasswordHashingService],
})
export class PasswordHashingModule {}
