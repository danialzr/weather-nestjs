import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";


@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy  {
    private client: Redis;

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        const host = this.configService.get<string>('REDIS_HOST');
        const port = this.configService.get<number>('REDIS_PORT');

        this.client = new Redis({
            host: host,
            port: port
        })

        this.client.on('connect', () => {
            console.log('connected to redis✔')
        })
        this.client.on('error', (err) => {
            console.log('Redis NotConnect❌', err)
        })
    }

    async set(key: string, value: string, ttl?: number) {
        if(ttl) await this.client.set(key, value, 'EX', ttl)
        else await this.client.set(key, value)
    }

    async get(key: string) {
        return this.client.get(key)
    }

    async del(key: string) {
        await this.client.del(key)
    }

    onModuleDestroy() {
        this.client.quit();
    }
}