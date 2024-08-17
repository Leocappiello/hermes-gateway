import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';
import { Public } from './auth/public.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(@Res() respoonse: Response): any {
    const filePath = join(__dirname, '..', 'index.html');
    return respoonse.sendFile(filePath);
  }

  @Public()
  @Get('/terms')
  getTerms(@Res() respoonse: Response): any {
    const filePath = join(__dirname, '..', 'oauthindex.html');
    return respoonse.sendFile(filePath);
  }
  //   status specifies the login status of the person using the app. The status can be one of the following:
  // connected - the person is logged into Facebook, and has logged into your app.
  // not_authorized - the person is logged into Facebook, but has not logged into your app.
  // unknown - the person is not logged into Facebook, so you don't know if they've logged into your app or FB.logout() was called before and therefore, it cannot connect to Facebook.
  // authResponse is included if the status is connected and is made up of the following:
  // accessToken - contains an access token for the person using the app.
  // expiresIn - indicates the UNIX time when the token expires and needs to be renewed.
  // signedRequest - a signed parameter that contains information about the person using the app.
  // userID - the ID of the person using the app.
  // Once your app knows the login status of the person using it, it can do
}
