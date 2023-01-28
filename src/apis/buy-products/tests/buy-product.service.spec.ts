import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../../repositories/user.repository';
import { ResponseWithData } from '../../../common/entities/response.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuyProductService } from '../buy-product.service';
import { BuyProductValidator } from '../buy-product.validator';
import { AuthModule } from '../../../apis/auth/auth.module';
import { ProductsModule } from '../../../apis/products/product.module';
import { UsersModule } from '../../../apis/users/user.module';
import { BuyProductModule } from '../buy-product.module';

describe(' Testing Security Questions Service', () => {
    let service: BuyProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, ProductsModule, UsersModule, BuyProductModule],
            providers: [BuyProductService,BuyProductValidator, UsersRepository, PrismaService],
        }).compile();

        service = module.get<BuyProductService>(BuyProductService);
    });

    it('should check if payload is empty when buying product', async () => {
        const data: ResponseWithData = await service.buyProduct({
            amountOfProduct: 1,
            productId:""
        },"567");

        expect(data.status).toEqual(400);
        expect(data.message).toEqual('Product Id is not allowed to be empty');
    });

    it('should check if product exist', async () => {
        const data: ResponseWithData = await service.buyProduct({
            amountOfProduct: 1,
            productId: "ggggg"
        },'56656');
        expect(data.status).toEqual(400);
        expect(data.message).toEqual('Product does not exist');
    });

});
