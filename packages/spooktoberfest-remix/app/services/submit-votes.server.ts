import { globalCacheService } from "./cache.server";
import { VoterCard } from "./sign-voter-card.server";

export type Position = "first" | "second" | "third";
export type MovieId = string;

export const submitVotes = async (votes: Record<Position, MovieId>, seen: MovieId[], voterCard: VoterCard) => {
  const voterData = {
    ...voterCard,
    votes,
    seen: seen ?? [],
    votedAt: new Date().toISOString(),
  };
  await globalCacheService.set(`votes:${voterCard.key}`, JSON.stringify(voterData));
};
