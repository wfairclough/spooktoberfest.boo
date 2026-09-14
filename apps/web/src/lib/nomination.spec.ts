import { describe, expect, it } from 'vitest';
import { readNomination, validateNomination } from './nomination';

describe('validateNomination', () => {
	it('requires two distinct movie titles', () => {
		expect(validateNomination('', '', '')).toEqual({
			nominatorName: 'Tell us who is sending this double feature.',
			movieOne: 'Choose your first feature.',
			movieTwo: 'Choose your second feature.'
		});
		expect(validateNomination('Ripley', 'The Thing', 'the thing')).toEqual({
			movieTwo: 'Pick two different movies for the double feature.'
		});
	});

	it('accepts a double feature with different titles', () => {
		expect(validateNomination('Ripley', 'The Thing', 'The Lost Boys')).toEqual({});
	});
});

describe('readNomination', () => {
	it('returns a valid nomination and ignores malformed cookie data', () => {
		const nomination = {
			id: 'test-id',
			nominatorName: 'Ripley',
			movieOne: 'Alien',
			movieTwo: 'The Fly',
			submittedAt: '2026-10-01T00:00:00.000Z'
		};
		expect(readNomination(encodeURIComponent(JSON.stringify(nomination)))).toEqual(nomination);
		expect(readNomination('not-json')).toBeNull();
	});
});
