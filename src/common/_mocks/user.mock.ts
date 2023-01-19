import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Constants } from '../enums/constants.enum';
import logger from '../../utils/logger';

@Injectable()
export class IsUserMock implements NestMiddleware {
  async use(req: any, res: Response, next: NextFunction) {
    try {
      // attach user to the request object
      req.user = {
        id: '7887799',
      };

      // success
      next();
    } catch (error) {
      logger.error(`An error occurred while authenticating user: ${error}`);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Constants.SERVER_ERROR });
    }
  }
}
