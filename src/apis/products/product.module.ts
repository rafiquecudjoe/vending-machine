import { Module } from '@nestjs/common';
import { ProductsRepository } from 'src/repositories/product.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { ProductsValidator } from './product.validator';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsValidator,
    ProductsRepository,
    PrismaService,
  ],
})
export class ProductsModule {}
