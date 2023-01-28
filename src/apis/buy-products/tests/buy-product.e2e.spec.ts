import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IsUserMock } from '../../../common/_mocks/user.mock';

import * as supertest from 'supertest';
import { BuyProductModule } from '../buy-product.module';
import { UsersModule } from '../../../apis/users/user.module';
import { ProductsModule } from '../../../apis/products/product.module';
import { AuthModule } from '../../../apis/auth/auth.module';
import { BuyProductService } from '../buy-product.service';
import { BuyProductValidator } from '../buy-product.validator';
import { UsersRepository } from '../../../repositories/user.repository';
import { PrismaService } from '../../../prisma/prisma.service';

describe('BuyProductService', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AuthModule, ProductsModule, UsersModule,BuyProductModule],
            providers: [BuyProductService, BuyProductValidator, UsersRepository, PrismaService],
        }).compile();

        app = moduleRef.createNestApplication().use(new IsUserMock().use);
        await app.init();
    });

    describe('POST /api/v1/buy', () => {
        it('checks if payload was submitted', async () => {
            const requestBody = {
                "productId": "6",
                "amountOfProduct": 1
            };

            const response = await supertest(app.getHttpServer())
                .post('/api/v1/buy')
                .send(requestBody);

            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(
                'ProductId is not allowed to be empty',
            );
        });

        it('checks if product exist', async () => {
            const requestBody = {
                "productId": "6",
                "amountOfProduct": 1
            };

            const response = await supertest(app.getHttpServer())
                .post('/api/v1/users')
                .send(requestBody);

            expect(response.status).toEqual(400);
            expect(response.body.message).toEqual(
                'Product does not exist',
            );
        });
    });
});
