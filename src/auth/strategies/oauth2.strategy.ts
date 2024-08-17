import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(private readonly configService: ConfigService) {
    super({
      authorizationURL:
        'https://www.facebook.com/v' +
        configService.getOrThrow('VERSION') +
        '.0/dialog/oauth',
      tokenURL: `https://graph.facebook.com/v${configService.getOrThrow(
        'VERSION',
      )}.0/oauth/access_token`,
      clientID: configService.getOrThrow('CLIENT_ID'),
      clientSecret: configService.getOrThrow('FB_SECRET'),
      callbackURL: `${configService.getOrThrow('BACK')}/auth/facebook/callback`,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Aquí puedes realizar validaciones y devolver el usuario
    console.log(accessToken, refreshToken, profile);
    return { accessToken };
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
