import { ConflictException, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BrowserContext, chromium, devices } from 'playwright';
import { CacheService } from './cache.service';

const scaryMeterMovieUrlPrefix = `https://scarymeter.com/movie/`;

@Injectable()
export class AppService implements OnApplicationBootstrap {
  #context: BrowserContext;

  constructor(
    private readonly cacheService: CacheService,
  ) {}

  async onApplicationBootstrap() {
    const browser = await chromium.launch();
    const context = await browser.newContext(devices['Desktop Chrome']);
    this.#context = context;
  }

  async getScaryMeterRating(movieId: string) {
    const cacheKey = `ratings:${movieId}`;
    const cachedRatings = await this.cacheService.get(cacheKey);
    if (cachedRatings) {
      return JSON.parse(cachedRatings);
    }
    const page = await this.#context.newPage();
    await page.goto(`${scaryMeterMovieUrlPrefix}${movieId}`);
    const notScaryHeading = page.locator('#notScaryMovieSubsectionHeading').first();
    const overallRatingLocator = page.locator('#overallScaryMeterRatingNumber').first();
    const creepyNumberLocator = page.locator('#creepyMeterRatingNumber').first();
    const jumpScareNumberLocator = page.locator('#jumpyMeterRatingNumber').first();
    const goreNumberLocator = page.locator('#goryMeterRatingNumber').first();
    await notScaryHeading.waitFor({ state: 'hidden', timeout: 50 }).catch(() => {
      throw new ConflictException('This is not a horror movie!');
    })
    const [
      overallRatingValue,
      creepyRatingValue,
      jumpScareRatingValue,
      goreRatingValue,
    ] = await Promise.allSettled([
      overallRatingLocator.textContent({ timeout: 500 }),
      creepyNumberLocator.textContent({ timeout: 500 }),
      jumpScareNumberLocator.textContent({ timeout: 500 }),
      goreNumberLocator.textContent({ timeout: 500 }),
    ]);
    const overallRating = overallRatingValue.status === 'fulfilled' ? parseFloat(overallRatingValue.value) : null;
    const creepyRating = creepyRatingValue.status === 'fulfilled' ? parseFloat(creepyRatingValue.value) : null;
    const jumpScareRating = jumpScareRatingValue.status === 'fulfilled' ? parseFloat(jumpScareRatingValue.value) : null;
    const goreRating = goreRatingValue.status === 'fulfilled' ? parseFloat(goreRatingValue.value) : null;

    const ratings = {
      overallRating,
      creepyRating,
      jumpScareRating,
      goreRating,
    };
    await this.cacheService.set(cacheKey, JSON.stringify(ratings), { EX: 3600 * 24 * 7 });


    return ratings;
  }
}

