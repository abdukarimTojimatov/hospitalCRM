import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appoinments.schema';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Patient, PatientDocument } from '../patients/schemas/patient.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctors.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { patient, doctor } = createAppointmentDto;

    const patientExists = await this.patientModel.exists({ _id: patient });
    if (!patientExists) {
      throw new BadRequestException('Invalid patient ID');
    }

    const doctorExists = await this.doctorModel.exists({ _id: doctor });
    if (!doctorExists) {
      throw new BadRequestException('Invalid doctor ID');
    }

    const appointment = new this.appointmentModel(createAppointmentDto);
    return appointment.save();
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel
      .find()
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName specialty')
      .exec();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName specialty')
      .exec();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async update(
    id: string,
    updateDto: Partial<CreateAppointmentDto>,
  ): Promise<Appointment> {
    if (updateDto.patient) {
      const patientExists = await this.patientModel.exists({
        _id: updateDto.patient,
      });
      if (!patientExists) {
        throw new BadRequestException('Invalid patient ID');
      }
    }

    if (updateDto.doctor) {
      const doctorExists = await this.doctorModel.exists({
        _id: updateDto.doctor,
      });
      if (!doctorExists) {
        throw new BadRequestException('Invalid doctor ID');
      }
    }

    const appointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName specialty')
      .exec();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Appointment not found');
    }
  }
}
