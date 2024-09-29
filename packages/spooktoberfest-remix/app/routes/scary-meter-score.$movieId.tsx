import { json, LoaderFunctionArgs } from "@remix-run/node";
import { globalCacheService } from "~/services/cache.service";
import { ScaryMeterService } from "~/services/scary-meter.service";

const scaryMeterService = new ScaryMeterService(
  globalCacheService,
);

export async function loader({ request, params }: LoaderFunctionArgs) {
  console.log("Scary Meter Score", { params });
  const movieId = params.movieId;
  const resp = await scaryMeterService.getScaryMeterRating(movieId!);
  return json(resp);
}


