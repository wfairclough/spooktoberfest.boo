import { fail } from '@sveltejs/kit';
import { readVote, validateVote, type Vote } from '$lib/vote';
import type { Actions, PageServerLoad } from './$types';

const voteCookie = 'spooktoberfest-2026-vote';

function normaliseVoterName(name: string) {
	return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

export const load: PageServerLoad = ({ cookies }) => ({ vote: readVote(cookies.get(voteCookie)) });

export const actions: Actions = {
	vote: async ({ request, cookies, platform }) => {
		const existingVote = readVote(cookies.get(voteCookie));
		if (existingVote) return { vote: existingVote };

		const formData = await request.formData();
		const voterName = String(formData.get('voterName') ?? '').trim();
		const choices = [
			String(formData.get('choiceOne') ?? ''),
			String(formData.get('choiceTwo') ?? ''),
			String(formData.get('choiceThree') ?? '')
		];
		const values = { voterName, choices };
		const errors = validateVote(voterName, choices);
		if (Object.keys(errors).length > 0) return fail(400, { errors, values });

		const vote: Vote = {
			id: crypto.randomUUID(),
			voterName,
			choices,
			submittedAt: new Date().toISOString()
		};
		const database = platform?.env.NOMINATIONS_DB;
		if (!database && !import.meta.env.DEV) {
			return fail(503, {
				message: 'Voting is temporarily unavailable. Please try again shortly.',
				values
			});
		}

		if (database) {
			try {
				await database.batch([
					database
						.prepare(
							'INSERT INTO votes (id, voter_name, voter_name_key, created_at) VALUES (?, ?, ?, ?)'
						)
						.bind(vote.id, vote.voterName, normaliseVoterName(vote.voterName), vote.submittedAt),
					...vote.choices.map((candidateId, index) =>
						database
							.prepare('INSERT INTO vote_choices (vote_id, candidate_id, rank) VALUES (?, ?, ?)')
							.bind(vote.id, candidateId, index + 1)
					)
				]);
			} catch {
				return fail(409, {
					message: 'A ballot has already been locked in under that name.',
					values
				});
			}
		}

		cookies.set(voteCookie, encodeURIComponent(JSON.stringify(vote)), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !import.meta.env.DEV,
			maxAge: 60 * 60 * 24 * 365
		});
		return { vote };
	}
};
