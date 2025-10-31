# IoT telemetry ingestor
 
 API service that collects telemetry readings from IoT devices stores them in mongodb caches the latest readings in redis and sends alerts to a webhook

## features
- accepts json
- stores in mongodb
- caches latest per device in redis
- sends alerts to webhook
- provides summary analytics

## webhook site URL
- ALERT_WEBHOOK_URL=https://webhook.site/34c5f111-9db5-45a7-8090-8a0766ffcece

- MongoDB connection string is stored in the `.env` file as `MONGO_URI`

- cloud Redis connection string is stored in the `.env` file as `REDIS_URL`


## Ai assistance
- asked AI to guide through set up redis through localhost or hosted platform
- asked AI to fix the error occur when running due to mismatch of nest.js version
- env file didn't connect to project asked AI for help
- asked AI to guide through webhook URL configur

## to setup
```bash
cd IotTelemetryIngestor
npm install
npm run start
