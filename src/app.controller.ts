import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, RequirePermission, UserInfo } from './custom.decorator';
import type { JwtUserData } from './login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @RequireLogin()
  @RequirePermission('ddd')
  getHello(@UserInfo() userinfo: JwtUserData): string {
    console.log(userinfo);
    return this.appService.getHello();
  }
}
