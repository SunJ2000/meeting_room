import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  async getValue(key: string) {
    return await this.redisClient.get(key);
  }

  async setValue(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
