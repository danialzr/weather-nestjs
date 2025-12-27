import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WeatherApiService } from './api/weather.api.service';
import { RedisService } from './redis.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly weatherApiService: WeatherApiService,
    private readonly redisService: RedisService,
  ) { }

  async getWeather(city: string = "Tehran") {
    let cachedData: string | null = null

    try {
      cachedData = await this.redisService.get(`weather:city:${city}`)
    } catch (error) {
      console.log('Redis is down', error.message)
    }
    if (cachedData) {
      console.log('call data from redis')
      return JSON.parse(cachedData)
    }

    try {
    const result = await this.weatherApiService.getCityData(city);
    console.log('call ApI')

    this.redisService.set(`weather:city:${city}`, JSON.stringify(result), 360)
      .catch(err => console.log('faild to save in Redis', err.message))

    return result
    } catch (error) {
      throw new HttpException(
        { message: 'امکان دریافت اطلاعات آب و هوا در حال حاضر وجود ندارد', city},
        HttpStatus.SERVICE_UNAVAILABLE,
      )
    }
  }

  async deleteCityCache(city: string) {
  try {
    await this.redisService.del(`weather:city:${city}`);
    return { message: `کش مربوط به شهر ${city} با موفقیت حذف شد` };
  } catch (error) {
    console.error('Redis Delete Error:', error.message);
    throw new HttpException('خطا در پاکسازی حافظه موقت', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}
