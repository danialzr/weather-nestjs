import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";

@Injectable()
export class WeatherApiService {
    // آدرس‌های جدید برای دقت بیشتر و پایداری
    private readonly geoUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    private readonly weatherUrl = 'https://api.open-meteo.com/v1/forecast';

    constructor(private readonly httpService: HttpService) {}

    async getCityData(city: string = "Urmia") {
        try {
            // مرحله ۱: پیدا کردن مختصات شهر (تبدیل اسم به طول و عرض جغرافیایی)
            const geoResponse = await firstValueFrom(
                this.httpService.get(`${this.geoUrl}?name=${city}&count=1&language=en`)
            );

            if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
                throw new Error('City not found');
            }

            const { latitude, longitude, name, country } = geoResponse.data.results[0];

            // مرحله ۲: گرفتن اطلاعات آب و هوا با استفاده از مختصات
            const weatherResponse = await firstValueFrom(
                this.httpService.get(`${this.weatherUrl}?latitude=${latitude}&longitude=${longitude}&current_weather=true&units=metric`)
            );

            const weather = weatherResponse.data.current_weather;

            // خروجی نهایی ترکیب شده
            return {
                city: name,
                country: country,
                coordinates: { lat: latitude, lon: longitude },
                temperature: weather.temperature, // دما به سانتی‌گراد
                windSpeed: weather.windspeed,     // سرعت باد
                conditionCode: weather.weathercode, // کد وضعیت (مثلاً ۳ برای ابری)
                time: weather.time,
            };

        } catch (error) {
            console.error('Error fetching data: ', error.message);
            throw new Error(`Failed to fetch weather data: ${error.message}`);
        }
    }
}