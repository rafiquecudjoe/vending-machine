import { HttpStatus, Injectable } from '@nestjs/common';
import { Constants } from '../../common/enums/constants.enum';
import { Response } from '../../common/response';
import logger from '../../utils/logger';
import {
  ResponseWithData,
  ResponseWithoutData,
} from '../../common/entities/response.entity';
import { ProductsValidator } from './product.validator';
import { ProductsRepository } from 'src/repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productValidator: ProductsValidator,
    private readonly productRepository: ProductsRepository,
  ) {}

  async addProduct(
    params: CreateProductDto,
    sellerId: string,
  ): Promise<ResponseWithoutData> {
    try {
      // validate create product params
      const validationResults =
        await this.productValidator.validateCreateProduct(params);
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // save product
      await this.productRepository.AddProduct(
        {
          cost: params.cost,
          name: params.name,
        },
        sellerId,
      );

      // success
      return Response.withoutData(
        HttpStatus.CREATED,
        'Product saved successfully',
      );
    } catch (error) {
      logger.error(`An error occurred while saving product: ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }

  async getAllProducts(): Promise<ResponseWithData> {
    try {
      // retrieve all products
      const users = await this.productRepository.retrieveAllProducts();

      return Response.withData(
        HttpStatus.OK,
        'Products retrieved successfully',
        users,
      );
    } catch (error) {
      logger.error(`An error occurred while retrieving product: ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }

  async updateProduct(
    sellerId: string,
    data: UpdateProductDto,
    productId: string,
  ): Promise<ResponseWithData> {
    try {
      // validate update user
      const validationResults =
        await this.productValidator.validatePatchProduct({
          data,
          productId,
          sellerId,
        });
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // update product
      await this.productRepository.updateProduct(sellerId, data);

      // success
      return Response.withoutData(
        HttpStatus.OK,
        'Product updated successfully',
      );
    } catch (error) {
      logger.error(`An error occurred while updating product: ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }

  async deleteProduct(
    sellerId: string,
    productId: string,
  ): Promise<ResponseWithData> {
    try {
      // validate delete product
      const validationResults =
        await this.productValidator.validateRemoveProduct(sellerId, productId);
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // delete product
      await this.productRepository.removeProduct(sellerId);

      // success
      return Response.withoutData(
        HttpStatus.OK,
        'Product deleted successfully',
      );
    } catch (error) {
      logger.error(`An error occurred while deleting product: ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }

  async getAProduct(productId: string): Promise<ResponseWithData> {
    try {
      // retrieve product
      const product = await this.productRepository.retrieveProductById(
        productId,
      );

      // success
      return Response.withData(
        HttpStatus.OK,
        'Product retrieved successfully',
        product,
      );
    } catch (error) {
      logger.error(`An error occurred while getting product: ${error}`);
      return Response.withoutData(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Constants.SERVER_ERROR,
      );
    }
  }
}
