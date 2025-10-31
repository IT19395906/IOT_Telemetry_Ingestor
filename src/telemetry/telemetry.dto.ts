/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsISO8601, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested, } from 'class-validator';


export class TelemetryDto {
    @IsString()
    @IsNotEmpty()
    deviceId: string;

    @IsString()
    @IsNotEmpty()
    siteId: string;

    @IsISO8601()
    ts: string;

    @ValidateNested()
    @Type(() => MetricsDto)
    @IsObject()
    metrics: MetricsDto;
}

class MetricsDto {
    @IsNumber()
    temperature: number;

    @IsNumber()
    humidity: number;
}