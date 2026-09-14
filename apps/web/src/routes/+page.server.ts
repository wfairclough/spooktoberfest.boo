import { fail } from '@sveltejs/kit';
import { readNomination, validateNomination, type Nomination } from '$lib/nomination';
import type { Actions, PageServerLoad } from './$types';

const nominationCookie = 'spooktoberfest-2026-nomination';

export const load: PageServerLoad = ({ cookies }) => ({
	nomination: readNomination(cookies.get(nominationCookie))
});

export const actions: Actions = {
	default: async ({ request, cookies, platform }) => {
		const existingNomination = readNomination(cookies.get(nominationCookie));
		if (existingNomination) return { nomination: existingNomination };
		const formData = await request.formData();
		const nominatorName = String(formData.get('nominatorName') ?? '').trim();
		const movieOne = String(formData.get('movieOne') ?? '').trim();
		const movieTwo = String(formData.get('movieTwo') ?? '').trim();
		const values = { nominatorName, movieOne, movieTwo };
		const errors = validateNomination(nominatorName, movieOne, movieTwo);
		if (Object.keys(errors).length > 0) return fail(400, { errors, values });
		const nomination: Nomination = {
			id: crypto.randomUUID(),
			nominatorName,
			movieOne,
			movieTwo,
			submittedAt: new Date().toISOString()
		};
		const database = platform?.env.NOMINATIONS_DB;
		if (database) {
			await database
				.prepare(
					'INSERT INTO nominations (id, nominator_name, movie_one, movie_two, created_at) VALUES (?, ?, ?, ?, ?)'
				)
				.bind(
					nomination.id,
					nomination.nominatorName,
					nomination.movieOne,
					nomination.movieTwo,
					nomination.submittedAt
				)
				.run();
		} else if (!import.meta.env.DEV) {
			return fail(503, {
				message: 'Nominations are temporarily unavailable. Please try again shortly.',
				values
			});
		}
		cookies.set(nominationCookie, encodeURIComponent(JSON.stringify(nomination)), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !import.meta.env.DEV,
			maxAge: 60 * 60 * 24 * 365
		});
		return { nomination };
	}
};
