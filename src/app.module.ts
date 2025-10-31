/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TelemetryModule } from './telemetry/telemetry.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRoot(process.env.MONGO_URI!), TelemetryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
