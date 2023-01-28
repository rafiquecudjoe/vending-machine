import { Module } from '@nestjs/common';
import { ProductsRepository } from '../../repositories/product.repository';
import { UsersRepository } from '../../repositories/user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/product.module';
import { UsersModule } from '../users/user.module';
import { BuyProductController } from './buy-product.controller';
import { BuyProductService } from './buy-product.service';
import { BuyProductValidator } from './buy-product.validator';

@Module({
  imports: [AuthModule, ProductsModule, UsersModule],
  controllers: [BuyProductController],
  providers: [
    BuyProductService,
    BuyProductValidator,
    PrismaService,
    UsersRepository,
    ProductsRepository,
  ],
})
export class BuyProductModule {}
