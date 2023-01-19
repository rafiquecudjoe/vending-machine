import { Module } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UsersValidator } from './user.validator';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UsersValidator, UsersRepository, PrismaService],
})
export class UsersModule {}
