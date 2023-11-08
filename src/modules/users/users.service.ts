import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({ where: { id: id } });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
}
