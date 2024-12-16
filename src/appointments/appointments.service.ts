import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appoinments.schema';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Patient, PatientDocument } from '../patients/schemas/patient.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctors.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppointmentsGateway } from './appointments.gateway'; // Import the gateway

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: PaginateModel<AppointmentDocument>,

    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    private appointmentsGateway: AppointmentsGateway, // Inject the gateway
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
    const newAppointment = await appointment.save();
    const allAppointments = await this.appointmentModel
      .find()
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName specialty')
      .exec();

    await this.appointmentsGateway.sendAllAppointments(allAppointments);
    return newAppointment;
  }

  async findAll(
    page: number,
    limit: number,
    status?: string,
    patientId?: string,
    doctorId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<PaginateResult<Appointment>> {
    const filters: any = {};
    if (status) {
      filters.status = status;
    }
    if (patientId) {
      filters.patient = patientId;
    }
    if (doctorId) {
      filters.doctor = doctorId;
    }
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999); // Set to the last millisecond of the day
        filters.createdAt.$lte = endOfDay;
      }
    }

    const options = {
      page,
      limit,
      populate: [
        { path: 'patient', select: 'firstName lastName' },
        { path: 'doctor', select: 'firstName lastName specialty' },
      ],
      sort: { createdAt: -1 },
    };

    try {
      let result = await this.appointmentModel.paginate(filters, options);
      return result;
    } catch (error) {
      throw new BadRequestException('Error fetching appointments');
    }
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
