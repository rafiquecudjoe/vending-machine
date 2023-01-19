import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user.repository';
import { ResponseWithoutData } from '../../common/entities/response.entity';
import { Response } from '../../common/response';
import {
  CreateDepositDto,
  CreateUserDto,
  UpdateUserDto,
} from './dtos/user.dto';
import * as joi from 'joi';
import { JoiValidator } from '../../utils/joi.validator';

@Injectable()
export class UsersValidator {
  constructor(private readonly positionsRepository: UsersRepository) {}

  validateCreateUser(params: CreateUserDto): Promise<ResponseWithoutData> {
    return new Promise(async (resolve, reject) => {
      try {
        // Joi Validation
        const joiSchema = joi
          .object({
            username: joi.string().min(3).label('Username').required(),
            password: joi.string().min(6).label('Password').required(),
            role: joi
              .string()
              .valid('seller', 'buyer')
              .label('Role')
              .required(),
          })
          .strict();

        // checks the result of validation
        const joiValidationresults = JoiValidator.validate(joiSchema, params);
        if (joiValidationresults)
          return resolve(
            Response.withoutData(HttpStatus.BAD_REQUEST, joiValidationresults),
          );

        // check if user already exist
        const retrievedUser =
          await this.positionsRepository.retrieveUserByUsername(
            params.username,
          );
        if (retrievedUser)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'User with thisusername already exist',
            ),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }

  validateRemoveuser(userId: string): Promise<ResponseWithoutData> {
    return new Promise(async (resolve, reject) => {
      try {
        // check if user already exist
        const retrievedUser = await this.positionsRepository.retrieveUserById(
          userId,
        );
        if (!retrievedUser)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'User with this id does not exist',
            ),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }

  validateRetrieveUser(userId: string): Promise<ResponseWithoutData> {
    return new Promise(async (resolve, reject) => {
      try {
        // check if user exist
        const retrievedUser = await this.positionsRepository.retrieveUserById(
          userId,
        );
        if (!retrievedUser)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'User with this id does not exist',
            ),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }

  validatePatch(
    userId: string,
    params: UpdateUserDto,
  ): Promise<ResponseWithoutData> {
    return new Promise(async (resolve, reject) => {
      try {
        // Joi Validation
        const joiSchema = joi
          .object({
            password: joi.string().min(6).label('Password'),
            role: joi.string().valid('seller', 'buyer').label('Role'),
          })
          .strict();

        // checks the result of validation
        const joiValidationresults = JoiValidator.validate(joiSchema, params);
        if (joiValidationresults)
          return resolve(
            Response.withoutData(HttpStatus.BAD_REQUEST, joiValidationresults),
          );

        // check if user already exist
        const retrievedUser = await this.positionsRepository.retrieveUserById(
          userId,
        );
        if (!retrievedUser)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'User with this id does not exist',
            ),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }

  validateDeposit(params: CreateDepositDto, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Joi Validation
        const joiSchema = joi
          .object({
            amount: joi
              .number()
              .valid(5, 10, 20, 50, 100)
              .label('Amount')
              .required(),
          })
          .strict();

        // checks the result of validation
        const joiValidationresults = JoiValidator.validate(joiSchema, params);
        if (joiValidationresults)
          return resolve(
            Response.withoutData(HttpStatus.BAD_REQUEST, joiValidationresults),
          );

        // check if user already exist
        const retrievedUser = await this.positionsRepository.retrieveUserById(
          userId,
        );
        if (!retrievedUser)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'User with this id does not exist',
            ),
          );

        // Check if busyers deposits is greater than 0
        const isBuyersDepositGreaterThan0 = retrievedUser.deposits > 0;

        if (isBuyersDepositGreaterThan0)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'You can only make 1 deposit at time. Please reset to 0 or buy a product',
            ),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }

  validateResetDeposit(userId: string): Promise<ResponseWithoutData> {
    return new Promise(async (resolve, reject) => {
      try {
        // check if user exist
        const retrievedUser = await this.positionsRepository.retrieveUserById(
          userId,
        );
        if (!retrievedUser)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'User with this id does not exist',
            ),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }
}
