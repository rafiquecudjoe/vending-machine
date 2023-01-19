import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '../apis/users/dtos/user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  registerUser(params: CreateUserDto): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prismaService.user.create({
          data: {
            password: params.password,
            role: params.role,
            username: params.username,
          },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  retrieveUserByUsername(username: string): Promise<User | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prismaService.user.findUnique({
          where: {
            username,
          },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  retrieveUserById(userId: string): Promise<User | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prismaService.user.findFirst({
          where: {
            id: userId,
          },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  retrieveAllUsers(): Promise<User[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await this.prismaService.user.findMany({});

        resolve(users);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateUser(userId: string, params: UpdateUserDto): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.update({
          where: {
            id: userId,
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

  removeUser(userId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.delete({
          where: {
            id: userId,
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  addBuyerDeposit(userId: string, amount: number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: {
            deposits: amount,
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  reduceBuyerDepositAfterBuyingProduct(
    userId: string,
    amount: number,
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: {
            deposits: { decrement: amount },
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  resetBuyerDeposit(userId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: {
            deposits: 0,
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteAll(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.deleteMany();
      } catch (error) {
        reject(error);
      }
    });
  }
}
