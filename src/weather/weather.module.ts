import { Global, Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiService } from './api/weather.api.service';
import { HttpModule } from '@nestjs/axios';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [WeatherController],
  providers: [RedisService, WeatherService, WeatherApiService],
  exports: [RedisService]
})
export class WeatherModule {}
