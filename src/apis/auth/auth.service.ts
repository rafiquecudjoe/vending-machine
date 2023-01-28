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
import { Request } from 'express';
import redis from '../../common/redis';

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

  async login(loginDto: LoginDto, req: Request): Promise<ResponseWithData> {
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

      // check if active session exist for user
      const getData = await redis.KEYS(`*${user.id}*`);
      if (getData.length > 0) {
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          'There is already an active session using your account',
        );
      }

      const jwt = this.jwtService.sign({
        username,
      });

      // set keys to redis
      await redis.SET(`${jwt}:${user.id}`, JSON.stringify(req.user));

      return Response.withData(HttpStatus.OK, 'User successfully logged in', {
        token: jwt,
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

  async logoutActiveSessions(
    req: Request,
    authToken: any,
  ): Promise<ResponseWithData> {
    try {
      // get gwt
      const jwt = authToken.split(' ')[1];

      // check jwt from redis
      const retrievedJwt = await redis.KEYS(`*${jwt}*`);
      if (retrievedJwt.length === 0) {
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          'There is no active session using your account',
        );
      }

      // delete jwt from cache
      await redis.DEL(retrievedJwt[0]);

      return Response.withoutData(
        HttpStatus.OK,
        'All active sessions terminated',
      );
    } catch (error) {
      logger.error(`An error occurred while logging in. Error:${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }
}
