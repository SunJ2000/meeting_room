import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
    unique: true,
  })
  username: string;

  @Column({
    length: 100,
    comment: '密码',
  })
  password: string;

  @Column({
    length: 50,
    comment: '昵称',
  })
  nickname: string;

  @Column({
    length: 100,
    comment: '邮箱',
  })
  email: string;

  @Column({
    length: 100,
    comment: '手机号',
    nullable: true,
  })
  mobile: string;

  @Column({
    length: 100,
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    default: false,
    comment: '是否冻结',
  })
  is_frozen: boolean;

  @Column({
    default: false,
    comment: '是否是管理员',
  })
  is_admin: boolean;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];
}
