
import { createClient, RedisClientType } from 'redis';

class RedisScanIterable implements AsyncIterable<string> {
  private redis: ReturnType<typeof createClient>;
  private pattern: string;
  private count: number;

  constructor(redis: RedisClientType, pattern: string = '*', count: number = 30) {
    this.redis = redis;
    this.pattern = pattern;
    this.count = count;
  }

  [Symbol.asyncIterator](): AsyncIterator<string> {
    let cursor = 0;
    let isDone = false;
    let batch: string[] = [];

    const loadBatch = async (): Promise<void> => {
      if (isDone) return;

      const [newCursor, keys] = await this.redis.scan(cursor, {
        MATCH: this.pattern,
        COUNT: this.count
      });
      cursor = newCursor;
      batch = keys;

      if (cursor === 0) {
        isDone = true; // Finished scanning
      }
    };

    return {
      next: async (): Promise<IteratorResult<string>> => {
        if (batch.length === 0) {
          await loadBatch();
        }

        if (batch.length > 0) {
          return { value: batch.shift()!, done: false };
        } else {
          return { value: null, done: true };
        }
      }
    };
  }
}

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

  getScanner(pattern: string): AsyncIterable<string> {
    return new RedisScanIterable(this.client, pattern);
  }

}

export const globalCacheService = new CacheService(process.env.REDIS_URL!);
