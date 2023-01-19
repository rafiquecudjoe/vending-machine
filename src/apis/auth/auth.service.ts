import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResponseWithData } from '../../common/entities/response.entity';
import { Response } from '../../common/response';
import logger from '../../utils/logger';
import { Constants } from '../../common/enums/constants.enum';
import { UsersRepository } from '../../repositories/user.repository';
import { LoginDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly userRepository: UsersRepository,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.retrieveUserByUsername(username);
    if (!user) {
      return null;
    }
    const validatePassword = await bcrypt.compare(pass, user.password);
    if (user && validatePassword) {
      const { password, ...result } = user;
      return result;
    }
  }

  async login(loginDto: LoginDto): Promise<ResponseWithData> {
    try {
      const { username, password } = loginDto;

      const user = await this.prismaService.user.findUnique({
        where: { username },
      });

      if (!user) {
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          'Invalid email or password',
        );
      }

      const validatePassword = await bcrypt.compare(password, user.password);

      if (!validatePassword) {
        throw new UnauthorizedException('invalid password');
      }

      return Response.withData(HttpStatus.OK, 'User successfully logged in', {
        token: this.jwtService.sign({
          username,
        }),
        user,
      });
    } catch (error) {
      logger.error(`An error occurred while logging in. Error:${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }
}
