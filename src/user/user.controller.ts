import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registeruser.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    await this.redisService.setValue(`captcha_${address}`, code, 5 * 60);
    return '发送成功';
  }

  @Get('init-data')
  async initData() {
    return await this.userService.initData();
  }

  @Post('login')
  async userlogin(@Body() LoginUserDto: LoginUserDto) {
    return await this.userService.login(LoginUserDto, false);
  }

  @Post('admin/login')
  adminlogin(@Body() LoginUserDto: LoginUserDto) {
    return this.userService.login(LoginUserDto, true);
  }
}
