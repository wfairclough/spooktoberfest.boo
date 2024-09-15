import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class CacheService implements OnApplicationBootstrap {
  #client: RedisClientType;

  constructor(
    @Inject('REDIS_URL') private readonly redisUrl: string,
  ) {}

  async onApplicationBootstrap() {
    this.#client = createClient({
      url: this.redisUrl,
    });
    await this.#client.connect();
  }

  async get(key: string) {
    return this.#client.get(key);
  }

  async set(
    key: string,
    value: string,
    params: { EX?: number } = {}
  ) {
    return this.#client.set(key, value, { EX: params.EX });
  }

}
