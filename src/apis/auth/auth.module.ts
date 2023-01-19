import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../../repositories/user.repository';
import { JwtStrategy } from './stategies/jwt.strategy';
import { LocalStrategy } from './stategies/local.strategy';
import { config } from '../../config/config';
import { UsersService } from '../users/user.service';
import { UsersValidator } from '../users/user.validator';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    UsersRepository,
    LocalStrategy,
    UsersService,
    UsersValidator,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
