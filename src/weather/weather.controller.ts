import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { WeatherService } from './weather.service';


@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) { }

  @Get(':city')
  async create(@Param('city') city: string) {
    if (!city || city.trim().length === 0) {
      throw new BadRequestException('نام شهر نمی‌تواند خالی باشد');
    }

    return await this.weatherService.getWeather(city);
  }

  @Delete(':city')
  async removeCache(@Param('city') city: string) {
    if (!city || city.trim().length === 0) {
      throw new BadRequestException('نام شهر برای حذف کش الزامی است');
    }

    return await this.weatherService.deleteCityCache(city);
  }

}
