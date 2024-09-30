
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


  async keys(pattern: string) {
    return this.client.keys(pattern);
  }

  async mGet(keys: string[]) {
    return this.client.mGet(keys);
  }

  async scan(cursor: number, pattern: string) {
    return this.client.scan(cursor, {
      MATCH: pattern,
      COUNT: 1000,
    });
  }

}

export const globalCacheService = new CacheService(process.env.REDIS_URL!);
