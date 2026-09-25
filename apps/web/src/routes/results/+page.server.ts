import { candidates, type Candidate } from '$lib/candidates';
import {
	currentBallotCount,
	currentStandings,
	type StandingSnapshotRow
} from '$lib/current-standings';
import type { PageServerLoad } from './$types';

export type RankedCandidate = Candidate & StandingSnapshotRow & { rank: number };

export const load: PageServerLoad = () => {
	const candidatesById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
	const rankings = currentStandings.flatMap((standing, index) => {
		const candidate = candidatesById.get(standing.id);
		return candidate ? [{ ...candidate, ...standing, rank: index + 1 }] : [];
	});

	return { rankings, ballotCount: currentBallotCount, unavailable: false };
};
