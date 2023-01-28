import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IsUserMock } from '../../../common/_mocks/user.mock';

import * as supertest from 'supertest';
import { UsersModule } from '../user.module';
import { Roles } from '@prisma/client';

describe('SecurityQuestionsService', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleRef.createNestApplication().use(new IsUserMock().use);
    await app.init();
  });

  describe('POST /api/v1/users', () => {
    it('checks if payload was submitted', async () => {
      const requestBody = {
        password: '',
        role: Roles.buyer,
        username: '',
      };

      const response = await supertest(app.getHttpServer())
        .post('/api/v1/users')
        .send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual(
        'Username is not allowed to be empty',
      );
    });

    it('checks if users are added successfully', async () => {
      const requestBody = {
        password: 'Flipmone1',
        role: Roles.buyer,
        username: 'Rafique7',
      };

      const response = await supertest(app.getHttpServer())
        .post('/api/v1/users')
        .send(requestBody);

      expect(response.status).toEqual(201);
    });
  });

  describe('GET /api/v1/users', () => {
    it('checks if users retrieved successfully', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/api/v1/users')
        .send();

      expect(response.status).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('BUY /api/v1/deposit', () => {
    it('checks if deposit was successful', async () => {
      const requestBody = {
        amount: 10,
      };
      const response = await supertest(app.getHttpServer())
        .post('/api/v1/deposit')
        .send(requestBody);

      expect(response.status).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });
});
