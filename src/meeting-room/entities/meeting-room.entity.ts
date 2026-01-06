import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MeetingRoom {
  @PrimaryGeneratedColumn({
    comment: '会议室id',
  })
  id: number;

  @Column({
    comment: '会议室名称',
    length: 50,
  })
  name: string;

  @Column({
    comment: '会议室容量',
  })
  capacity: number;

  @Column({
    comment: '会议室位置',
    length: 50,
  })
  location: string;

  @Column({
    comment: '会议室设备',
    length: 50,
    nullable: true,
  })
  equipment: string;

  @Column({
    comment: '会议室描述',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column({
    comment: '会议室是否被预约',
    default: false,
  })
  isBooked: boolean;

  @CreateDateColumn({
    comment: '会议室创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '会议室更新时间',
  })
  updateTime: Date;
}
