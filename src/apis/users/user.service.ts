import { HttpStatus, Injectable } from '@nestjs/common';
import { Constants } from '../../common/enums/constants.enum';
import { Response } from '../../common/response';
import logger from '../../utils/logger';
import {
  ResponseWithData,
  ResponseWithoutData,
} from '../../common/entities/response.entity';
import { UsersValidator } from './user.validator';
import { UsersRepository } from '../../repositories/user.repository';
import {
  CreateDepositDto,
  CreateUserDto,
  UpdateUserDto,
} from './dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersValidator: UsersValidator,
    private readonly usersRepository: UsersRepository,
  ) {}

  async addUser(params: CreateUserDto): Promise<ResponseWithoutData> {
    try {
      // validate create user params
      const validationResults = await this.usersValidator.validateCreateUser(
        params,
      );
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // hash password
      const hashedPassword = await bcrypt.hash(params.password, 10);

      // save user
      await this.usersRepository.registerUser({
        username: params.username,
        role: params.role,
        password: hashedPassword,
      });

      // success
      return Response.withoutData(
        HttpStatus.CREATED,
        'User saved successfully',
      );
    } catch (error) {
      logger.error(`An error occurred while saving user: ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }

  async getAllUsers(): Promise<ResponseWithData> {
    try {
      // retrieve all users
      const users = await this.usersRepository.retrieveAllUsers();

      return Response.withData(
        HttpStatus.OK,
        'Users retrieved successfully',
        users,
      );
    } catch (error) {
      logger.error(`An error occurred while retrieving user: ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }

  async updateUser(
    userId: string,
    data: UpdateUserDto,
  ): Promise<ResponseWithData> {
    try {
      // validate update user
      const validationResults = await this.usersValidator.validatePatch(
        userId,
        data,
      );
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // hash password if payload includes password
      let hashedPassword;
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }

      // update user
      await this.usersRepository.updateUser(userId, {
        password: hashedPassword,
        role: data.role,
      });

      // success
      return Response.withoutData(HttpStatus.OK, 'User updated successfully');
    } catch (error) {
      logger.error(`An error occurred while updating user: ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }

  async deleteUser(userId: string): Promise<ResponseWithData> {
    try {
      // validate delete user
      const validationResults = await this.usersValidator.validateRemoveuser(
        userId,
      );
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // delete user
      await this.usersRepository.removeUser(userId);

      // success
      return Response.withoutData(HttpStatus.OK, 'User deleted successfully');
    } catch (error) {
      logger.error(`An error occurred while deleting user: ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }

  async getAUser(userId: string): Promise<ResponseWithData> {
    try {
      // validate retrieve user
      const validationResults = await this.usersValidator.validateRetrieveUser(
        userId,
      );
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // retrieve user
      const user = await this.usersRepository.retrieveUserById(userId);

      // success
      return Response.withData(
        HttpStatus.OK,
        'User retrieved successfully',
        user,
      );
    } catch (error) {
      logger.error(`An error occurred while getting user: ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }

  async deposit(
    buyerId: string,
    params: CreateDepositDto,
  ): Promise<ResponseWithData> {
    try {
      // validate retrieve user
      const validationResults: any = await this.usersValidator.validateDeposit(
        params,
        buyerId,
      );
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // reset buyer deposit
      await this.usersRepository.addBuyerDeposit(buyerId, params.amount);

      // success
      return Response.withoutData(
        HttpStatus.OK,
        'Deposit Processed Successfully',
      );
    } catch (error) {
      logger.error(
        `An error occurred while depositing coins for user: ${error}`,
      );
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }

  async resetDeposit(buyerId: string): Promise<ResponseWithData> {
    try {
      // validate retrieve user
      const validationResults: any =
        await this.usersValidator.validateResetDeposit(buyerId);
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // reset buyer deposit
      await this.usersRepository.resetBuyerDeposit(buyerId);

      // success
      return Response.withoutData(HttpStatus.OK, 'Deposit Reset Successfully');
    } catch (error) {
      logger.error(
        `An error occurred while reseting deposit for user: ${error}`,
      );
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }
}
