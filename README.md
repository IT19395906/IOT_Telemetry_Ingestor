# IoT telemetry ingestor
 
 API service that collects telemetry readings from IoT devices stores them in mongodb caches the latest readings in redis and sends alerts to a webhook

## features
- accepts json
- stores in mongodb
- caches latest per device in redis
- sends alerts to webhook
- provides summary analytics

## to setup
```bash
cd IotTelemetryIngestor
npm install
npm run start
