import { Permission } from '../entities/perimission.entity';

interface UserInfo {
  id: number;

  username: string;

  nickname: string;

  email: string;

  avatar: string;

  mobile: string;

  is_frozen: boolean;

  is_admin: boolean;

  createTime: Date;

  roles: string[];

  permissions: Permission[];
}

export class LoginUserVo {
  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}
