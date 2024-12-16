import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '../schemas/appoinments.schema';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  patient: string;

  @IsNotEmpty()
  @IsString()
  doctor: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsNumber()
  queuePosition: number;

  @IsOptional()
  @IsDateString()
  createdAt?: string;
}
