export type Nomination = {
	movieOne: string;
	movieTwo: string;
	submittedAt: string;
};

export function readNomination(value: string | undefined): Nomination | null {
	if (!value) return null;

	try {
		const nomination = JSON.parse(decodeURIComponent(value)) as Nomination;
		if (
			typeof nomination.movieOne === 'string' &&
			typeof nomination.movieTwo === 'string' &&
			typeof nomination.submittedAt === 'string'
		) {
			return nomination;
		}
	} catch {
		// A stale or malformed cookie should behave like a new visit.
	}

	return null;
}

export function validateNomination(movieOne: string, movieTwo: string) {
	const errors: Record<string, string> = {};
	if (!movieOne) errors.movieOne = 'Choose your first feature.';
	if (!movieTwo) errors.movieTwo = 'Choose your second feature.';
	if (movieOne && movieTwo && movieOne.toLowerCase() === movieTwo.toLowerCase()) {
		errors.movieTwo = 'Pick two different movies for the double feature.';
	}
	return errors;
}
