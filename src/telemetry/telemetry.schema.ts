/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Telemetry extends Document {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  siteId: string;

  @Prop({ required: true })
  ts: Date;

  @Prop({ type: { temperature: Number, humidity: Number, }, })
  metrics: { temperature: number; humidity: number; };
}

export const TelemetrySchema = SchemaFactory.createForClass(Telemetry);
