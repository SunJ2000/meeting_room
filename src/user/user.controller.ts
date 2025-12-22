import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registeruser.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { generateParseIntPipe } from 'src/utils';

@Controller('user')
@RequireLogin()
export class UserController {
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

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

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify<{ userId: number }>(refreshToken);
      const user = await this.userService.findUserById(data.userId);
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Get('info')
  async info(@UserInfo('userId') userid: number) {
    const user = await this.userService.findUserDetailById(userid);
    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.nickname = user.nickname;
    vo.avatar = user.avatar;
    vo.mobile = user.mobile;
    vo.is_admin = user.is_admin;
    vo.is_frozen = user.is_frozen;
    vo.createTime = user.create_time;

    return vo;
  }

  @Get('freeze')
  async freeze(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId);
    return 'success';
  }
  @Get('list')
  async userlist(
    @Query('page', generateParseIntPipe('page'))
    page: number,
    @Query('pageSize', generateParseIntPipe('pageSize'))
    pageSize: number,
    @Query('username') username: string,
    @Query('nickname') nickname: string,
    @Query('email') email: string,
  ) {
    return await this.userService.findUsersByPage(
      page,
      pageSize,
      username,
      nickname,
      email,
    );
  }
}
