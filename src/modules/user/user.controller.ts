import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from './entities/user.entity';
import { Role } from '@prisma/client';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Get all users (Admin/Super Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
  })
  async getAll(@Request() req) {
    return this.userService.getAll(req.user.role);
  }

  @Get('stats')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Get user statistics for admin dashboard' })
  @ApiResponse({
    status: 200,
    description: 'User statistics',
  })
  async getStats() {
    return this.userService.getStats();
  }

  @Post()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Create a new user (Admin/Super Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  async createUser(@Body() dto: CreateUserDto, @Request() req) {
    return this.userService.createUser(dto, req.user.role);
  }

  @Delete(':id')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID to delete', type: Number })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: User,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Cannot delete self or higher role',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.userService.deleteUser(id, req.user.id, req.user.role);
  }
}
