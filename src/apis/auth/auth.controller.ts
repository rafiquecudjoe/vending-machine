import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthUser from '../../common/decorators/auth-user.decorator';
import { AuthGuard } from '@nestjs/passport';

import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseWithoutData } from '../../common/entities/response.entity';
import { Constants } from '../../common/enums/constants.enum';
import { Response } from 'express';
import { CreateUserDto } from '../users/dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UsersService } from '../users/user.service';
import { LoginDto } from './dtos/auth.dto';
import { User } from '@prisma/client';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'Used to login a user',
  })
  @ApiCreatedResponse({
    description: 'User successfully logged In',
    type: ResponseWithoutData,
  })
  @ApiConflictResponse({
    description: 'Bad request, User Does Not Exist',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async register(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { status, ...responseData } = await this.authService.login(loginDto);

    return res.status(status).send(responseData);
  }

  @Post('/register')
  @ApiOperation({
    summary: 'Used to register a user',
  })
  @ApiCreatedResponse({
    description: 'User successfully Registerred',
    type: ResponseWithoutData,
  })
  @ApiConflictResponse({
    description: 'Conflict, User Already Exist',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async addSecurityQuestion(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const { status, ...responseData } = await this.userService.addUser(
      createUserDto,
    );

    return res.status(status).send(responseData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getLoggedUser(@AuthUser() user: User): User {
    return user;
  }
}
