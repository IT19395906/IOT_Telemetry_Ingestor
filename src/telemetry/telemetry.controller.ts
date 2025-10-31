/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TelemetryDto } from './telemetry.dto';

@Controller('api/v1')
export class TelemetryController {

    constructor(private readonly telemetryService: TelemetryService) { }

    @Post('telemetry')
    async saveData(@Body() body: TelemetryDto | TelemetryDto[]) {
        return this.telemetryService.saveData(body);
    }

    @Get('devices/:deviceId/latest')
    async getLatestReading(@Param('deviceId') deviceId: string) {
        return this.telemetryService.getLatestReading(deviceId);
    }

    @Get('sites/:siteId/summary')
    async getSiteSummaryData(@Param('siteId') siteId: string, @Query('from') from: string, @Query('to') to: string,) {
        return this.telemetryService.getSiteSummaryData(siteId, new Date(from), new Date(to));
    }

}
