import { candidateIds } from './candidates';

export type Vote = {
	id: string;
	voterName: string;
	choices: string[];
	submittedAt: string;
};

export function readVote(value: string | undefined): Vote | null {
	if (!value) return null;
	try {
		const vote = JSON.parse(decodeURIComponent(value)) as Vote;
		if (
			typeof vote.id === 'string' &&
			typeof vote.voterName === 'string' &&
			Array.isArray(vote.choices) &&
			vote.choices.length === 3 &&
			vote.choices.every((choice) => typeof choice === 'string' && candidateIds.has(choice)) &&
			typeof vote.submittedAt === 'string'
		) {
			return vote;
		}
	} catch {
		// An invalid cookie is treated as a fresh voter.
	}
	return null;
}

export function validateVote(voterName: string, choices: string[]) {
	const errors: Record<string, string> = {};
	if (!voterName) errors.voterName = 'Tell us whose ballot this is.';
	if (
		choices.length !== 3 ||
		new Set(choices).size !== 3 ||
		choices.some((choice) => !candidateIds.has(choice))
	) {
		errors.choices = 'Choose three different films before locking in your ballot.';
	}
	return errors;
}
