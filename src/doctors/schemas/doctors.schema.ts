import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  specialty: string;

  @Prop({ required: true })
  contactNumber: string;

  @Prop()
  email?: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
