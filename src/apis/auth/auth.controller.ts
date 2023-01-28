import { Controller, Post, Body, UseGuards, Res, Req, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
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
import { Request, Response } from 'express';
import { LoginDto } from './dtos/auth.dto'
import { JwtAuthGuard } from './guards/jwt.guard';



@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

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
  async register(@Body() loginDto: LoginDto, @Res() res: Response, @Req() req: Request) {
    const { status, ...responseData } = await this.authService.login(loginDto, req);
    return res.status(status).send(responseData);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @Get('logout/all')
  @ApiOperation({
    summary: 'Used to logout all active sessions for a user',
  })
  @ApiCreatedResponse({
    description: 'All active sessions ended',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async logoutAllSessions(@Res() res: Response, @Req() req: Request) {
    const authToken = req.headers.authorization
    const { status, ...responseData } = await this.authService.logoutActiveSessions(req,authToken);
    return res.status(status).send(responseData);
  }
}
