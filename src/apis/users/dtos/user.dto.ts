import { Roles } from '@prisma/client';

export class CreateUserDto {
  username: string;
  password: string;
  role: Roles;
}

export class UpdateUserDto {
  password?: string;
  role?: Roles;
}

export class CreateDepositPreviewDto {
  amount: number;
}

export class CreateDepositDto {
  amount: number;
}
