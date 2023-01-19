import { HttpStatus, Injectable } from '@nestjs/common';
import { Constants } from '../../common/enums/constants.enum';
import { Response } from '../../common/response';
import logger from '../../utils/logger';
import { ResponseWithoutData } from '../../common/entities/response.entity';
import { UsersRepository } from '../../repositories/user.repository';
import { BuyProductValidator } from './buy-product.validator';
import { BuyProductDto } from './dtos/buy-product.dto';
import { ProductsRepository } from 'src/repositories/product.repository';

@Injectable()
export class BuyProductService {
  constructor(
    private readonly usersValidator: BuyProductValidator,
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async buyProduct(
    params: BuyProductDto,
    userId: string,
  ): Promise<ResponseWithoutData> {
    try {
      // validate create user params
      const validationResults = await this.usersValidator.validateBuyProduct(
        params,
      );
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // retrieve Product
      const product = await this.productsRepository.retrieveProductById(
        params.productId,
      );
      if (!product)
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          'Product does not exist',
        );

      // calculate total amount to be spent
      const totalAmountToSpend: number = product.cost * params.amountOfProduct;

      // check if users deposit is enough to buy
      const user = await this.usersRepository.retrieveUserById(userId);
      if (!user)
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          'User does not exist',
        );

      const doesUserHaveEnoughDepositToBuyProduct =
        user?.deposits >= totalAmountToSpend;
      if (doesUserHaveEnoughDepositToBuyProduct === false)
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          'You do not have enough balance to buy product',
        );

      // deduct total amount to spend from deposit
      await this.usersRepository.reduceBuyerDepositAfterBuyingProduct(
        userId,
        totalAmountToSpend,
      );

      // calculate change
      const changeAfterProductPurchase = user.deposits - totalAmountToSpend;

      // success
      return Response.withData(
        HttpStatus.CREATED,
        'Product Bought successfully',
        {
          'Total Amount Spent': totalAmountToSpend,
          'Product Purchased': product.productName,
          Change: changeAfterProductPurchase,
        },
      );
    } catch (error) {
      logger.error(`An error occurred while buying product ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }
}
