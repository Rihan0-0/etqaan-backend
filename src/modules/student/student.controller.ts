import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StudentService } from './services/student.service';
import { CreateStudentDto } from './dtos/create-student.dto';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students with optional filtering' })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'phone', required: false })
  findAll(@Query('name') name?: string, @Query('phone') phone?: string) {
    return this.studentService.findAll({ name, phone });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update student' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateStudentDto>,
  ) {
    return this.studentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete student' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.remove(id);
  }
}
