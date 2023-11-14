import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async hash(secret: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(secret, saltRounds);
  }

  async compare(plainSecret: string, hashedSecret: string): Promise<boolean> {
    return bcrypt.compare(plainSecret, hashedSecret);
  }
}
