import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { globalCacheService } from "~/services/cache.server";
import { globalMoviesService } from "~/services/movies.server";

export const loader: LoaderFunction = async ({}: LoaderFunctionArgs) => {
  const keys: string[] = [];
  for await (const key of globalCacheService.getScanner("votes:*")) {
    keys.push(key);
  }
  const jsonStrValues = await globalCacheService.mGet(keys);
  const votes = jsonStrValues.map((v) => v && (JSON.parse(v) as unknown));
  for (const v of votes) {
    const vote = v as any;
    vote.votes.first = await globalMoviesService.getMovieDetails(
      vote.votes.first,
    );
    vote.votes.second = await globalMoviesService.getMovieDetails(
      vote.votes.second,
    );
    vote.votes.third = await globalMoviesService.getMovieDetails(
      vote.votes.third,
    );
    vote.seen = await Promise.all(
      vote.seen.map((id: number) =>
        globalMoviesService.getMovieDetails(id + ""),
      ),
    );
  }
  return json(
    {
      votes,
    },
    { status: 200 },
  );
};

export interface TallyPageProps {}

export function TallyPage({}: TallyPageProps) {
  const { votes } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Tally</h1>
      {votes.map((vote: any, index: number) => (<>
        <div key={index}>
          <h2>{vote.name}</h2>
          <ol className="list-decimal list-inside">
            <li>First: {vote.votes.first.title}</li>
            <li>Second: {vote.votes.second.title}</li>
            <li>Third: {vote.votes.third.title}</li>
          </ol>
          <h3>Seen:</h3>
          <ul>
            {vote.seen.map((movie: any, index: number) => (
              <li key={index}>{movie.title}</li>
            ))}
          </ul>
        </div>
        <br />
        </>
      ))}
    </main>
  );
}

export default TallyPage;
