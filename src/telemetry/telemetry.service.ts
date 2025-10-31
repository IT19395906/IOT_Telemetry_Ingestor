/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Telemetry } from './telemetry.schema';
import { Model } from 'mongoose';
import { TelemetryDto } from './telemetry.dto';
import axios from 'axios';

@Injectable()
export class TelemetryService {

    private redis: Redis;
    private logger = new Logger(TelemetryService.name);

    constructor(
        @InjectModel(Telemetry.name) private telemetryModel: Model<Telemetry>,
    ) {
        this.redis = new Redis(process.env.REDIS_URL!);
    }

    async saveData(data: TelemetryDto | TelemetryDto[]) {
        const entries = Array.isArray(data) ? data : [data];
        await this.telemetryModel.insertMany(entries);

        for (const item of entries) {
            await this.redis.set(`latest:${item.deviceId}`, JSON.stringify(item));
            const { temperature, humidity } = item.metrics;
            if (temperature > 50) {
                await this.sendAlert(item, 'HIGH_TEMPERATURE', temperature);
            }
            if (humidity > 90) {
                await this.sendAlert(item, 'HIGH_HUMIDITY', humidity);
            }
        }
    }

    async sendAlert(item: TelemetryDto, reason: string, value: number) {
        try {
            await axios.post(process.env.ALERT_WEBHOOK_URL!, { deviceId: item.deviceId, siteId: item.siteId, ts: item.ts, reason, value, });
        } catch (error) {
            this.logger.error('failed to send alert', error);
            console.error(error);
        }
    }

    async getLatestReading(deviceId: string) {
        const cached = await this.redis.get(`latest:${deviceId}`);
        if (cached) return JSON.parse(cached) as Telemetry;
        const latest = await this.telemetryModel.findOne({ deviceId }).sort({ ts: -1 }).lean();

        if (latest) await this.redis.set(`latest:${deviceId}`, JSON.stringify(latest));
        return latest;
    }

    async getSiteSummaryData(siteId: string, from: Date, to: Date) {
        return this.telemetryModel.aggregate([
            { $match: { siteId, ts: { $gte: from, $lte: to }, }, },
            { $group: { _id: null, count: { $sum: 1 }, avgTemperature: { $avg: '$metrics.temperature' }, maxTemperature: { $max: '$metrics.temperature' }, avgHumidity: { $avg: '$metrics.humidity' }, maxHumidity: { $max: '$metrics.humidity' }, uniqueDevices: { $addToSet: '$deviceId' }, }, },
            { $project: { _id: 0, count: 1, avgTemperature: 1, maxTemperature: 1, avgHumidity: 1, maxHumidity: 1, uniqueDevices: { $size: '$uniqueDevices' }, }, },
        ]);
    }
}
