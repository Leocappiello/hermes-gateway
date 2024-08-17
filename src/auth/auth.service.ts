import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/user/prisma.service';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { SignupDTO } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getUser(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.prismaService.users.findUnique({
      where: { username },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    console.log(token);
    return { access_token: token };
  }

  async register(signupDto: SignupDTO): Promise<any> {
    const existingUser = await this.prismaService.users.findFirst({
      where: {
        OR: [{ username: signupDto.username }, { email: signupDto.email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === signupDto.username) {
        throw new BadRequestException('Username already taken');
      }
      if (existingUser.email === signupDto.email) {
        throw new BadRequestException('Email already in use');
      }
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    console.log(hashedPassword);
    const user = await this.prismaService.users.create({
      data: {
        id: uuidv4(),
        email: signupDto.email,
        password: hashedPassword,
        username: signupDto.username,
      },
    });

    return {
      token: this.jwtService.sign(
        { username: user.username },
        {
          secret: this.configService.getOrThrow('SECRET'),
        },
      ),
    };
  }

  // async testOauth() {
  //   passport.use(
  //     new OAuth2Strategy(
  //       {
  //         authorizationURL:
  //           'https://www.facebook.com/v' +
  //           this.configService.getOrThrow('VERSION') +
  //           '.0/dialog/oauth',
  //         tokenURL:
  //           'https://graph.facebook.com/' +
  //           this.configService.getOrThrow('VERSION') +
  //           '/oauth/access_token',
  //         clientID: this.configService.getOrThrow('CLIENT_ID'),
  //         clientSecret: this.configService.getOrThrow('FB_SECRET'),
  //         callbackURL:
  //           this.configService.getOrThrow('BACK') + 'auth/facebook/callback',
  //       },
  //       function (accessToken, refreshToken, profile, done) {
  //         console.log(accessToken, refreshToken, profile);
  //         // Aquí puedes guardar el token y la información del usuario en la base de datos
  //         return done(null, { accessToken });
  //       },
  //     ),
  //   );
  // }
}
