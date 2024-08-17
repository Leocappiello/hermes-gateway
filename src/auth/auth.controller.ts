import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { SignupDTO } from './dto/signup.dto';
import { Public } from './public.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() loginDto: LoginDTO,
  ): Promise<any> {
    try {
      const result = await this.authService.login(
        loginDto.username,
        loginDto.password,
      );

      return response.send(result);
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        status: 'Ok!',
        message: 'Internal server error',
      });
    }
  }

  @Public()
  @Post('register')
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body() signupDto: SignupDTO,
  ): Promise<any> {
    try {
      const result = await this.authService.register(signupDto);
      return response.status(201).json(result);
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        return response.status(400).json({
          status: 'Error',
          message: error.message,
        });
      }
      return response.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
  }

  @Get('testfacebook')
  @UseGuards(AuthGuard('oauth2'))
  testFB(@Req() req: Request) {
    return;
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('oauth2'))
  async facebookCallback(@Req() req: Request, @Res() res: Response) {
    // Aquí obtienes el token de acceso y rediriges o gestionas la sesión
    const accessToken = req.user;
    console.log(accessToken);
    return res.send(accessToken);
    //res.redirect(`/profile?accessToken=${accessToken}`);
  }
}
