import { fail } from '@sveltejs/kit';
import { readNomination, validateNomination, type Nomination } from '$lib/nomination';
import type { Actions, PageServerLoad } from './$types';

const nominationCookie = 'spooktoberfest-2026-nomination';

export const load: PageServerLoad = ({ cookies }) => ({
	nomination: readNomination(cookies.get(nominationCookie))
});

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const existingNomination = readNomination(cookies.get(nominationCookie));
		if (existingNomination) return { nomination: existingNomination };
		const formData = await request.formData();
		const movieOne = String(formData.get('movieOne') ?? '').trim();
		const movieTwo = String(formData.get('movieTwo') ?? '').trim();
		const values = { movieOne, movieTwo };
		const errors = validateNomination(movieOne, movieTwo);
		if (Object.keys(errors).length > 0) return fail(400, { errors, values });
		const nomination: Nomination = { movieOne, movieTwo, submittedAt: new Date().toISOString() };
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
