// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './schemas/users.schema';
import { AuthGuard } from '../auth/auth.guard'; // Import the custom AuthGuard

@Controller('users')
@UseGuards(AuthGuard, RolesGuard) // Apply custom AuthGuard and RolesGuard
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.CEO) // Only CEO can create users
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.CEO, UserRole.Admin) // CEO and Admin can view all users
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CEO, UserRole.Admin) // CEO and Admin can view a specific user
  findOne(@Param('id') id: string) {
    console.log('Fetching user with ID:', id);
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.CEO) // Only CEO can update users
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.CEO, UserRole.Admin) // CEO and Admin can delete users
  remove(@Param('id') id: string) {
    console.log('Deleting user with ID:', id);
    return this.usersService.remove(id);
  }
}
