export type Nomination = {
	id: string;
	nominatorName: string;
	movieOne: string;
	movieTwo: string;
	submittedAt: string;
};

export function readNomination(value: string | undefined): Nomination | null {
	if (!value) return null;

	try {
		const nomination = JSON.parse(decodeURIComponent(value)) as Nomination;
		if (
			typeof nomination.id === 'string' &&
			typeof nomination.nominatorName === 'string' &&
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

export function validateNomination(nominatorName: string, movieOne: string, movieTwo: string) {
	const errors: Record<string, string> = {};
	if (!nominatorName) errors.nominatorName = 'Tell us who is sending this double feature.';
	if (!movieOne) errors.movieOne = 'Choose your first feature.';
	if (!movieTwo) errors.movieTwo = 'Choose your second feature.';
	if (movieOne && movieTwo && movieOne.toLowerCase() === movieTwo.toLowerCase()) {
		errors.movieTwo = 'Pick two different movies for the double feature.';
	}
	return errors;
}
