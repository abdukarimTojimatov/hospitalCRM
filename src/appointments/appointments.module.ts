import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment, AppointmentSchema } from './schemas/appoinments.schema';
import { Patient, PatientSchema } from '../patients/schemas/patient.schema';
import { Doctor, DoctorSchema } from '../doctors/schemas/doctors.schema';
import { AppointmentsGateway } from './appointments.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Doctor.name, schema: DoctorSchema },
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsGateway],
})
export class AppointmentsModule {}
