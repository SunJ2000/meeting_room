import { Controller, Post } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Post('init-data')
  async initData() {
    return this.meetingRoomService.initData();
  }
}
