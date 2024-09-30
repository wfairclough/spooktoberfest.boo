import crypto from "node:crypto";
import {
  json,
  LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { z } from "zod";
import { globalCacheService } from "~/services/cache.service";
import ULID from "ulid";
import { useLoaderData } from "@remix-run/react";
import { globalMoviesService } from "~/services/movies.service";
import { Movie } from "~/models/movies";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import ScaryMeter from "~/components/scary-meter";
import { ScrollArea } from "@radix-ui/themes";

const NominationSchema = z.object({
  key: z.string().regex(/^[0-9A-Z]{26}$/),
  name: z.string().nonempty(),
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
  const values = jsonStrValues.map((v) => JSON.parse(v)) as unknown as Partial<
    NominationData & { movies: Movie[] }
  >[];
  for (const nom of values) {
    delete nom.email;
    nom.movies = [] as Movie[];
    for (const movieId of nom.movieIds ?? []) {
      const movie = await globalMoviesService.getMovieDetails(movieId + "");
      nom.movies.push(movie);
    }
  }

  return json(
    {
      message: "Not found",
      values,
    },
    200,
  );
}

const NominationsRoute = () => {
  const { message, values } = useLoaderData<typeof loader>();
  console.log(values);
  return (
    <>
      <section className="p-10">
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
