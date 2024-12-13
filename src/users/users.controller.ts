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
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User, UserRole } from './schemas/users.schema';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  userModel: any;
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
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.CEO) // Only CEO can update users
  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        updateUserDto, // Pass the partial DTO directly
        { new: true, select: { password: 0 } },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return updatedUser;
  }

  @Delete(':id')
  @Roles(UserRole.CEO) // Only CEO can delete users
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
