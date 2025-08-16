import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterForStudentService } from './services/register-for-student.service';
import { RegisterForStudentDto } from './dtos/register-for-student.dto';
import { LoginService } from './services/login.service';
import { LoginDto } from './dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerForStudentService: RegisterForStudentService,
    private readonly loginService: LoginService,
  ) {}

  @Post('register-student')
  @ApiOperation({ summary: 'Register a new student' })
  @ApiBody({ type: RegisterForStudentDto })
  @ApiResponse({ status: 201, description: 'Student registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async registerStudent(@Body() dto: RegisterForStudentDto) {
    const user = await this.registerForStudentService.registerStudent(dto);
    return {
      message: 'Student registered successfully',
      success: true,
      data: user,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.loginService.login(dto);
  }
}
