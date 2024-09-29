import { json, LoaderFunctionArgs } from "@remix-run/node";
import { globalCacheService } from "~/services/cache.service";
import { ScaryMeterService } from "~/services/scary-meter.service";

const scaryMeterService = new ScaryMeterService(
  globalCacheService,
);

export async function loader({ request, params }: LoaderFunctionArgs) {
  console.log("Scary Meter Score", { params });
  const movieId = params.movieId;
  try {
    const resp = await scaryMeterService.getScaryMeterRating(movieId!);
    return json(resp);
  } catch (err) {
    const error = err as unknown as any;
    if (error.status) {
      return json({
        message: error.message,
      }, {
        status: error.status,
      });
    }
    return json({
      message: "An unexpected error occurred: " + error.message,
    }, {
      status: 500,
    });
  }
}


