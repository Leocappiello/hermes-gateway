// import { Injectable } from '@nestjs/common';
// import { Prisma, usuarios } from '@prisma/client';
// import { PrismaService } from 'src/user/prisma.service';

import { ConflictException, Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from './prisma.service';

// @Injectable()
// export class UserService {
//   constructor(private prisma: PrismaService) {}

//   async user(
//     userWhereUniqueInput: Prisma.usuariosWhereUniqueInput,
//   ): Promise<usuarios | null> {
//     return this.prisma.usuarios.findUnique({
//       where: userWhereUniqueInput,
//     });
//   }

//   async findByUsernameAndEmail(username, email): Promise<usuarios | null> {
//     return this.prisma.usuarios.findFirst({
//       where: { OR: [{ username }, { email }] },
//     });
//   }

//   async users(params: {
//     skip?: number;
//     take?: number;
//     cursor?: Prisma.usuariosWhereUniqueInput;
//     where?: Prisma.usuariosWhereInput;
//     orderBy?: Prisma.usuariosOrderByWithRelationInput;
//   }): Promise<usuarios[]> {
//     const { skip, take, cursor, where, orderBy } = params;
//     return this.prisma.usuarios.findMany({
//       skip,
//       take,
//       cursor,
//       where,
//       orderBy,
//     });
//   }

//   async createUser(data: Prisma.usuariosCreateInput): Promise<usuarios> {
//     return this.prisma.usuarios.create({
//       data,
//     });
//   }

//   async updateUser(params: {
//     where: Prisma.usuariosWhereUniqueInput;
//     data: Prisma.usuariosUpdateInput;
//   }): Promise<usuarios> {
//     const { where, data } = params;
//     return this.prisma.usuarios.update({
//       data,
//       where,
//     });
//   }
// }

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(username: string) {
    return this.prisma.users.findUnique({
      where: {
        username,
      },
    });
  }

  async getAllUsers() {
    return this.prisma.users.findMany();
  }

  async createUser(data: Users): Promise<Users> {
    const existing = await this.prisma.users.findUnique({
      where: {
        username: data.username,
      },
    });

    if (existing) throw new ConflictException('Username already exists');

    return this.prisma.users.create({
      data,
    });
  }
}
