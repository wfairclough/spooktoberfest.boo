import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { globalCacheService } from "~/services/cache.server";
import { globalMoviesService } from "~/services/movies.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const keys: string[] = [];
  for await (const key of globalCacheService.getScanner("votes:*")) {
    keys.push(key);
  }
  const jsonStrValues = await globalCacheService.mGet(keys);
  const votes = jsonStrValues.map((v) => v && (JSON.parse(v) as unknown));
  const scores = new Map<string, number>();
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

    const addScore = (title: string, score: number) => {
      if (scores.has(title)) {
        scores.set(title, scores.get(title)! + score);
      } else {
        scores.set(title, score);
      }
    };

    addScore(vote.votes.first.title, 3);
    addScore(vote.votes.second.title, 2);
    addScore(vote.votes.third.title, 1);
  }
  return json(
    {
      votes,
      topScores: Array.from(scores.entries()).sort((a, b) => b[1] - a[1]),
      raw: url.searchParams.has("raw"),
    },
    { status: 200 },
  );
};

export interface TallyPageProps { }

export function TallyPage({ }: TallyPageProps) {
  const { votes, topScores, raw } = useLoaderData<typeof loader>();
  if (raw) {
    return (
      <main>
        <h1>Tally</h1>
        <pre>{JSON.stringify(topScores, null, 2)}</pre>
        {votes.map((vote: any, index: number) => (
          <React.Fragment key={index}>
            <div>
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
          </React.Fragment>
        ))}
      </main>
    );
  }

  return (
    <>
      <h1 className="text-2xl p-8">SpooktoberFest 2024 Tally</h1>
      <ol className="list-decimal px-16">
        {topScores.map(([title, score], index) => (
          <li key={index}>{title} ({score})</li>
        ))}
      </ol>
    </>
  );
}

export default TallyPage;
