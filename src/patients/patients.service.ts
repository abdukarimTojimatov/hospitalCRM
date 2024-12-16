import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { Model } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = new this.patientModel(createPatientDto);
    return patient.save();
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientModel.find().exec();
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) throw new NotFoundException('Invalid doctor ID');
    return patient;
  }

  async update(
    id: string,
    updateDto: Partial<CreatePatientDto>,
  ): Promise<Patient> {
    return await this.patientModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.patientModel.findByIdAndDelete(id).exec();
  }
}
