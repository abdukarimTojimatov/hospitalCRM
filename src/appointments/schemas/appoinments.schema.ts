import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 'scheduled', enum: ['scheduled', 'completed', 'cancelled'] })
  status: string;

  @Prop()
  reason?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
