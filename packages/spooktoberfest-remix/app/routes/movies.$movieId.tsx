import { json, LoaderFunctionArgs } from "@remix-run/node";
import { globalMoviesService } from "~/services/movies.service";

export async function loader({ request, params }: LoaderFunctionArgs) {
  console.log("Get Movie", { params });
  const movieId = params.movieId;
  try {
    const resp = await globalMoviesService.getMovieDetails(movieId!);
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



