import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SessionService } from '../session.service';
import { SaveBatchAttendanceDto } from '../dtos/save-attendance.dto';

@ApiTags('Sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ApiOperation({ summary: 'Save batch attendance and performance records' })
  saveAttendance(@Body() dto: SaveBatchAttendanceDto) {
    return this.sessionService.saveAttendance(dto);
  }
}
