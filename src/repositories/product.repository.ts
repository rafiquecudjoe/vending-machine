import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../apis/products/dtos/product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  AddProduct(params: CreateProductDto, sellerId: string): Promise<Product> {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await this.prismaService.product.create({
          data: {
            productName: params.name,
            cost: params.cost,
            sellerId,
            amountAvailable:params.amountAvailable
          },
        });
        resolve(product);
      } catch (error) {
        reject(error);
      }
    });
  }

  retrieveProductById(productId: string): Promise<Product | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await this.prismaService.product.findUnique({
          where: {
            id: productId,
          },
        });
        resolve(product);
      } catch (error) {
        reject(error);
      }
    });
  }

  retrieveProductByName(productName: string): Promise<Product | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prismaService.product.findUnique({
          where: {
            productName,
          },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  retrieveAllProducts(): Promise<Product[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const products = await this.prismaService.product.findMany({});

        resolve(products);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateProduct(productId: string, params: UpdateProductDto): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.product.update({
          where: {
            id: productId,
          },
          data: {
            ...params,
          },
        });

        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  removeProduct(productId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.product.delete({
          where: {
            id: productId
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  decreaseProductAmountAvailable(productId:string,amount:number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.product.update({
          where: {
            id: productId
          }, data: {
            amountAvailable:{decrement:amount}
          }
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }
}
