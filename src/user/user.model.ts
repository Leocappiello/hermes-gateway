import { Prisma } from '@prisma/client';

export class Users implements Prisma.UsersCreateInput {
  id: string;
  password: string;
  email: string;
  username: string;
}
