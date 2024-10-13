import crypto from "node:crypto";
import {
  json,
  LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { z } from "zod";
import { globalCacheService } from "~/services/cache.server";
import ULID from "ulid";
import { useLoaderData } from "@remix-run/react";
import { globalMoviesService } from "~/services/movies.server";
import { Movie } from "~/models/movies";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import ScaryMeter from "~/components/scary-meter";
import { ScrollArea } from "@radix-ui/themes";
import { globalScaryMeterService } from "~/services/scary-meter.server";
import { ScaryMeterRating } from "~/models/scary-meter-rating";

const NominationSchema = z.object({
  key: z.string().regex(/^[0-9A-Z]{26}$/),
  name: z.string().min(1),
  email: z.string().email(),
  movieIds: z.array(z.number()),
});

export type NominationData = z.infer<typeof NominationSchema>;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim()?.toLowerCase();
  const movies = formData.getAll("movieIds")?.map((id) => Number(id));
  const parseResult = NominationSchema.safeParse({
    key: ULID.ulid(),
    name,
    email,
    movieIds: movies,
  });
  if (!parseResult.success) {
    return json(
      {
        message: "Invalid nomination data",
        errors: parseResult.error.errors,
      },
      400,
    );
  }
  const nominationData = parseResult.data;
  const emailHash = hashEmail(nominationData.email);
  console.log(nominationData);
  globalCacheService.set(
    `nominations:${emailHash}`,
    JSON.stringify(nominationData),
  );
  return json(
    {
      key: nominationData.key,
      message: "Nomination submitted!",
    },
    201,
  );
}

function hashEmail(email: string) {
  return crypto.createHash("sha1").update(email).digest("hex");
}

// Loader
export async function loader({ request }: LoaderFunctionArgs) {
  const nomsKeys = await globalCacheService.keys("nominations:*");
  const jsonStrValues = await globalCacheService.mGet(nomsKeys);
  const values = jsonStrValues.map((v) => v && JSON.parse(v)) as unknown as Partial<
    NominationData & { movies: Movie[] }
  >[];
  const uniqueNoms = new Set<ScaryMeterRating>();
  for (const nom of values) {
    delete nom.email;
    nom.movies = [] as Movie[];
    for (const movieId of nom.movieIds ?? []) {
      const movie = await globalMoviesService.getMovieDetails(movieId + "");
      const scaryScore = await globalScaryMeterService.getScaryMeterRating(movieId + '').catch(() => (null));
      movie.scaryScore = scaryScore;
      nom.movies.push(movie);
      if (scaryScore) {
        uniqueNoms.add(scaryScore);
      } else {
        uniqueNoms.add({
          overallRating: 0,
          creepyRating: 0,
          jumpScareRating: 0,
          goreRating: 0,
        });
      }
    }
  }

  const overallAverage = Array.from(uniqueNoms).reduce((acc, curr) => acc += curr.overallRating ?? 0, 0) / uniqueNoms.size;
  const jumpScareAverage = Array.from(uniqueNoms).reduce((acc, curr) => acc += curr.jumpScareRating ?? 0, 0) / uniqueNoms.size;
  const creepyAverage = Array.from(uniqueNoms).reduce((acc, curr) => acc += curr.creepyRating ?? 0, 0) / uniqueNoms.size;
  const goreAverage = Array.from(uniqueNoms).reduce((acc, curr) => acc += curr.goreRating ?? 0, 0) / uniqueNoms.size;

  return json(
    {
      message: "Not found",
      values,
      averageScaryScore: {
        overallRating: overallAverage,
        jumpScareRating: jumpScareAverage,
        creepyRating: creepyAverage,
        goreRating: goreAverage,
      }
    },
    200,
  );
}

const NominationsRoute = () => {
  const { message, values, averageScaryScore } = useLoaderData<typeof loader>();
  console.log(values);
  return (
    <>
      <section className="p-10">

        <h1 className="font-bold text-4xl">Scary meter score average from nominations</h1>
        <div className="average-scary-score">
          <ScaryMeter movieId={0} scaryMeterRating={averageScaryScore} />
        </div>

        <h1 className="font-bold text-4xl">Nominations</h1>
        <ol className="list-decimal list-outside">
          {values.map((nom) => (
            <li key={nom.key} className="">
              <p className="font-bold text-xl">{nom.name}</p>
              <ul className="list-disc">
                {nom.movies?.map((movie, idx) => (
                  <li key={idx}>
                    <Popover>
                      <PopoverTrigger>{movie.title}</PopoverTrigger>
                      <PopoverContent
                        side="right"
                        className="w-[50vw] pt-4 pl-4 pr-4"
                      >
                        <ScrollArea
                          type="always"
                          scrollbars="vertical"
                          style={{ height: "60dvh" }}
                        >
                          <div className="flex flex-col">
                            <h2 className="text-2xl text-center">
                              {movie.title}
                            </h2>
                            <div className="grid place-items-center">
                              <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="max-h-[40vh] w-auto"
                              />
                            </div>
                            <p>{movie.overview}</p>
                            <ScaryMeter movieId={movie.id} />
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                  </li>
                ))}
              </ul>
              <br />
            </li>
          ))}
        </ol>
      </section>
    </>
  );
};

export default NominationsRoute;
