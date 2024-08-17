import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getAllUsers(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const result = await this.userService.getAllUsers();
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully fetch data',
        result,
      });
    } catch (error) {
      return response.status(500).json({
        status: 'Ok!',
        message: 'Internal server error',
      });
    }
  }
}
