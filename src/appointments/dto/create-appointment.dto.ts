import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patient: string; // This should be a valid ObjectId (string) referencing a Patient

  @IsString()
  @IsNotEmpty()
  doctor: string; // This should be a valid ObjectId (string) referencing a Doctor

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
