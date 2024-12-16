import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type AppointmentDocument = mongoose.HydratedDocument<Appointment>;

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(AppointmentStatus),
    default: AppointmentStatus.Scheduled,
  })
  status: AppointmentStatus;

  @Prop()
  reason?: string;

  @Prop({
    type: Number,
    required: false,
  })
  queuePosition?: number;

  @Prop({
    type: String,
    default: null,
  })
  notes?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
AppointmentSchema.plugin(mongoosePaginate);

// Pre-save hook to dynamically calculate queue position
AppointmentSchema.pre<AppointmentDocument>('save', async function (next) {
  if (this.isNew) {
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));

    const AppointmentModel = this.constructor as any;

    const appointmentCount = await AppointmentModel.countDocuments({
      doctor: this.doctor,
      appointmentDate: { $gte: todayStart, $lte: todayEnd },
      status: { $ne: AppointmentStatus.Cancelled },
    });

    this.queuePosition = appointmentCount + 1;
  }

  next();
});
