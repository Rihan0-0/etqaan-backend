import { Body, Controller, Post } from '@nestjs/common';
import { CreateSessionDto } from './dtos/create-session.dto';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  // @Post()
  // async createSession(@Body() createSessionDto: CreateSessionDto) {
  //     return await this.sessionService.create(createSessionDto);
  // }
}
