// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  CEO = 'CEO',
  Admin = 'Admin',
  Reception = 'Reception',
}

@Schema({ timestamps: true })
export class User {
  toObject(): { [x: string]: any; password: any } {
    throw new Error('Method not implemented.');
  }
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: UserRole, default: UserRole.Reception })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
