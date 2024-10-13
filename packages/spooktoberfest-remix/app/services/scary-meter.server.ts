import { BrowserContext, chromium, devices } from "playwright";
import { ConflictError } from "~/models/errors";
import { ScaryMeterRating } from "~/models/scary-meter-rating";
import { CacheService, globalCacheService } from "./cache.server";


const scaryMeterMovieUrlPrefix = `https://scarymeter.com/movie/`;

export class ScaryMeterService {
  #context!: BrowserContext;

  constructor(private readonly cacheService: CacheService) {
    this.onApplicationBootstrap();
  }

  async onApplicationBootstrap() {
    const browser = await chromium.launch();
    const context = await browser.newContext(devices["Desktop Chrome"]);
    this.#context = context;
  }

  async getContextInstance() {
    if (!this.#context) {
      await this.onApplicationBootstrap();
    }
    return this.#context;
  }

  async getScaryMeterRating(movieId: string): Promise<ScaryMeterRating> {
    const cacheKey = `ratings:${movieId}`;
    const cachedRatings = await this.cacheService.get(cacheKey);
    if (cachedRatings) {
      const json = JSON.parse(cachedRatings);
      if (json.error) {
        throw new ConflictError(json.error);
      }
      return json;
    }
    const ctx = await this.getContextInstance();
    const page = await ctx.newPage();
    await page.goto(`${scaryMeterMovieUrlPrefix}${movieId}`);
    const notScaryHeading = page
      .locator("#notScaryMovieSubsectionHeading")
      .first();
    const overallRatingLocator = page
      .locator("#overallScaryMeterRatingNumber")
      .first();
    const creepyNumberLocator = page
      .locator("#creepyMeterRatingNumber")
      .first();
    const jumpScareNumberLocator = page
      .locator("#jumpyMeterRatingNumber")
      .first();
    const goreNumberLocator = page.locator("#goryMeterRatingNumber").first();
    await notScaryHeading
      .waitFor({ state: "hidden", timeout: 200 })
      .catch(async (err) => {
        console.error(err);
        await this.cacheService.set(cacheKey, JSON.stringify({ error: 'This is not a horror movie!' }), { EX: 3600 * 24 * 30 });
        throw new ConflictError("This is not a horror movie!");
      });
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
    const overallRating =
      overallRatingValue.status === "fulfilled" && overallRatingValue.value
        ? parseFloat(overallRatingValue.value)
        : null;
    const creepyRating =
      creepyRatingValue.status === "fulfilled" && creepyRatingValue.value
        ? parseFloat(creepyRatingValue.value)
        : null;
    const jumpScareRating =
      jumpScareRatingValue.status === "fulfilled" && jumpScareRatingValue.value
        ? parseFloat(jumpScareRatingValue.value)
        : null;
    const goreRating =
      goreRatingValue.status === "fulfilled" && goreRatingValue.value
        ? parseFloat(goreRatingValue.value)
        : null;

    const ratings = {
      overallRating,
      creepyRating,
      jumpScareRating,
      goreRating,
    };
    await this.cacheService.set(cacheKey, JSON.stringify(ratings), {
      EX: 3600 * 24 * 7,
    });

    return ratings;
  }
}

export const globalScaryMeterService = new ScaryMeterService(
  globalCacheService,
);

