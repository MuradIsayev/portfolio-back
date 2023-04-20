import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';
import Redis from 'ioredis';

@Controller()
export class AppController {
  private readonly redis: Redis;
  constructor(
    private readonly appService: AppService,
    private readonly healthCheckService: HealthCheckService,
    private readonly redisIndicator: RedisHealthIndicator,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @HealthCheck()
  async healthChecks(): Promise<HealthCheckResult> {
    return await this.healthCheckService.check([
      () =>
        this.redisIndicator.checkHealth('redis', {
          type: 'redis',
          client: this.redis,
          timeout: 500,
        }),
    ]);
  }
}
