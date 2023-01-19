import { Test, TestingModule } from '@nestjs/testing';
import { Roles } from '@prisma/client';
import { UsersRepository } from '../../../repositories/user.repository';
import { ResponseWithData } from '../../../common/entities/response.entity';
import { UsersService } from '../user.service';
import { UsersValidator } from '../user.validator';
import { PrismaService } from '../../../prisma/prisma.service';

describe(' Testing Security Questions Service', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersValidator, UsersRepository, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should check if payload is empty when saving user', async () => {
    const data: ResponseWithData = await service.addUser({
      password: '',
      role: Roles.buyer,
      username: '',
    });

    expect(data.status).toEqual(400);
    expect(data.message).toEqual('Username is not allowed to be empty');
  });

  it('should save user successfully', async () => {
    const data: ResponseWithData = await service.addUser({
      password: 'Flipmone1',
      role: Roles.buyer,
      username: 'rafique20',
    });
    expect(data.status).toEqual(201);
    expect(data.message).toEqual('User saved successfully');
  });

  it('should retrieve all users', async () => {
    const data = await service.getAllUsers();
    expect(data.status).toEqual(200);
    expect(data.message).toEqual('Users retrieved successfully');
  });

  it('should check if quser exist when deleting user', async () => {
    const data = await service.deleteUser('5050505');
    expect(data.status).toEqual(400);
    expect(data.message).toEqual('User with this id does not exist');
  });

  it('should check if question exist when updating user', async () => {
    const data = await service.updateUser('5050506', {
      password: 'Flipmone2',
      role: Roles.buyer,
    });
    expect(data.status).toEqual(400);
    expect(data.message).toEqual('User with this id does not exist');
  });
});
