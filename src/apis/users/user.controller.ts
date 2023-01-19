import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseWithoutData } from '../../common/entities/response.entity';
import { Response } from 'express';
import { Constants } from '../../common/enums/constants.enum';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './user.service';
import {
  CreateDepositDto,
  CreateUserDto,
  UpdateUserDto,
} from './dtos/user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../common/decorators/roles.decorator';
import { Roles } from '@prisma/client';

@ApiTags('Users Endpoints')
@Controller('/api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  @ApiOperation({
    summary: 'Used to add add a user',
  })
  @ApiCreatedResponse({
    description: 'User added sucessfully',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async addUser(@Body() createUserParams: CreateUserDto, @Res() res: Response) {
    const { status, ...responseData } = await this.usersService.addUser(
      createUserParams,
    );

    return res.status(status).send(responseData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({
    summary: 'Used to get a user',
  })
  @ApiCreatedResponse({
    description: 'User successfully retrieved',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async retrieveUser(@Param('id') userId: string, @Res() res: Response) {
    const { status, ...responseData } = await this.usersService.getAUser(
      userId,
    );

    return res.status(status).send(responseData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  @ApiOperation({
    summary: 'Used to get all users',
  })
  @ApiCreatedResponse({
    description: 'users successfully retrieved',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async getAllPositions(@Res() res: Response) {
    const { status, ...responseData } = await this.usersService.getAllUsers();

    return res.status(status).send(responseData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({
    summary: 'Used to update a user',
  })
  @ApiCreatedResponse({
    description: 'User successfully updated',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async updateUser(
    @Param('id') userId: string,
    @Body() payload: UpdateUserDto,
    @Res() res: Response,
  ) {
    const { status, ...responseData } = await this.usersService.updateUser(
      userId,
      payload,
    );

    return res.status(status).send(responseData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({
    summary: 'Used to delete a user',
  })
  @ApiCreatedResponse({
    description: 'User successfully deleted',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async deletePosition(@Param('id') userId: string, @Res() res: Response) {
    const { status, ...responseData } = await this.usersService.deleteUser(
      userId,
    );

    return res.status(status).send(responseData);
  }

  @Role(Roles.buyer)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post(':userId/deposit')
  @ApiOperation({
    summary: 'Used to deposit coins for a buyer',
  })
  @ApiCreatedResponse({
    description: 'Coins successfully deposited for user',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async deposit(
    @Param('userId') userId: string,
    @Body() payload: CreateDepositDto,
    @Res() res: Response,
  ) {
    const { status, ...responseData } = await this.usersService.deposit(
      userId,
      payload,
    );

    return res.status(status).send(responseData);
  }
  @Role(Roles.buyer)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId/reset')
  @ApiOperation({
    summary: 'Used to reset a buyers deposits',
  })
  @ApiCreatedResponse({
    description: 'Coins successfully deposited for user',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async resetDeposit(@Param('userId') userId: string, @Res() res: Response) {
    const { status, ...responseData } = await this.usersService.resetDeposit(
      userId,
    );

    return res.status(status).send(responseData);
  }
}
