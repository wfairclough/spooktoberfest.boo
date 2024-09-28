
import { createClient, RedisClientType } from 'redis';

export class CacheService {
  #client: RedisClientType | null = null;

  get client(): RedisClientType {
    return this.#client ??= createClient({
      url: this.redisUrl,
    });
  }

  constructor(
    private readonly redisUrl: string,
  ) {
    this.client.connect();
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(
    key: string,
    value: string,
    params: { EX?: number } = {}
  ) {
    return this.client.set(key, value, { EX: params.EX });
  }

}

export const globalCacheService = new CacheService(process.env.REDIS_URL!);
