export type ScaryMeterRatings = { scary: number; creepy: number; gory: number; jumpy: number };
export type Candidate = {
	id: string;
	title: string;
	nominators: string[];
	trailerQuery: string;
	posterPath: string;
	scaryMeterUrl: string;
	ratings: ScaryMeterRatings | null;
};
const rating = (scary: number, creepy: number, gory: number, jumpy: number): ScaryMeterRatings => ({
	scary,
	creepy,
	gory,
	jumpy
});

// Poster paths and ratings were sourced from each film's public Scary Meter record on 2026-09-18.
export const candidates: Candidate[] = [
	{
		id: 'bring-her-back',
		title: 'Bring Her Back',
		nominators: ['Liam'],
		trailerQuery: 'Bring Her Back official trailer',
		posterPath: '/1Q3GlCXGYWELifxANYZ5OVMRVZl.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1151031',
		ratings: rating(7.6, 8.3, 8.8, 2.7)
	},
	{
		id: 'scary-movie-2026',
		title: 'Scary Movie (2026)',
		nominators: ['Liam'],
		trailerQuery: 'Scary Movie 2026 official trailer',
		posterPath: '/znHT8peERZRWG1ME3r0Db0EV8k8.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1273221',
		ratings: null
	},
	{
		id: 'sixth-sense',
		title: 'The Sixth Sense',
		nominators: ['Anne'],
		trailerQuery: 'The Sixth Sense official trailer',
		posterPath: '/vOyfUXNFSnaTk7Vk5AjpsKTUWsu.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/745',
		ratings: rating(5.0, 8.2, 2.0, 5.7)
	},
	{
		id: 'get-out',
		title: 'Get Out',
		nominators: ['Anne'],
		trailerQuery: 'Get Out official trailer',
		posterPath: '/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/419430',
		ratings: rating(5.7, 8.8, 2.4, 2.7)
	},
	{
		id: '28-years-later',
		title: '28 Years Later',
		nominators: ['Marissa'],
		trailerQuery: '28 Years Later official trailer',
		posterPath: '/n5FygjEppOvac6yEaowi26nTyw3.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1100988',
		ratings: rating(5.4, 6.2, 7.3, 3.5)
	},
	{
		id: '28-years-later-bone-temple',
		title: '28 Years Later: The Bone Temple',
		nominators: ['Marissa'],
		trailerQuery: '28 Years Later The Bone Temple official trailer',
		posterPath: '/kK1BGkG3KAvWB0WMV1DfOx9yTMZ.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1272837',
		ratings: rating(6.0, 6.7, 9.2, 1.7)
	},
	{
		id: 'shaun-of-the-dead',
		title: 'Shaun of the Dead',
		nominators: ['Libby'],
		trailerQuery: 'Shaun of the Dead official trailer',
		posterPath: '/dgXPhzNJH8HFTBjXPB177yNx6RI.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/747',
		ratings: rating(2.4, 0.9, 8.8, 2.2)
	},
	{
		id: 'trick-r-treat',
		title: "Trick 'r Treat",
		nominators: ['Libby'],
		trailerQuery: 'Trick r Treat official trailer',
		posterPath: '/w0nmol4g7n6MFfhfphV7GzHHYjB.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/23202',
		ratings: rating(6.6, 7.6, 8.5, 6.5)
	},
	{
		id: 'send-help',
		title: 'Send Help',
		nominators: ['Brent Belanger'],
		trailerQuery: 'Send Help official trailer horror',
		posterPath: '/zbJWVHOtj3ljBzWgL1P8pxP03Up.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1198994',
		ratings: rating(4.7, 3.7, 8.4, 4.7)
	},
	{
		id: 'hokum',
		title: 'Hokum',
		nominators: ['Brent Belanger', 'Joelle', 'Aish'],
		trailerQuery: 'Hokum official trailer horror',
		posterPath: '/x6rHcQFiYcczLQPrmxXPAicm54E.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1430077',
		ratings: rating(9.0, 10.0, 0, 8.5)
	},
	{
		id: 'the-witch',
		title: 'The Witch',
		nominators: ['Joelle'],
		trailerQuery: 'The Witch official trailer',
		posterPath: '/zap5hpFCWSvdWSuPGAQyjUv2wAC.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/310131',
		ratings: rating(6.9, 8.1, 4.1, 2.4)
	},
	{
		id: 'the-birds',
		title: 'The Birds',
		nominators: ['Sarah S'],
		trailerQuery: 'The Birds official trailer',
		posterPath: '/eClg8QPg8mwB6INIC4pyR5pAbDr.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/571',
		ratings: rating(3.6, 5.9, 3.4, 3.1)
	},
	{
		id: 'backrooms',
		title: 'Backrooms',
		nominators: ['Sarah S', 'Josh R'],
		trailerQuery: 'Backrooms official trailer horror',
		posterPath: '/rhGx6E3qRNMgj3i5su2oukNHwIQ.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1083381',
		ratings: rating(6.9, 9.6, 2.1, 6.0)
	},
	{
		id: 'barbarian-2022',
		title: 'Barbarian (2022)',
		nominators: ['Dan'],
		trailerQuery: 'Barbarian 2022 official trailer',
		posterPath: '/idT5mnqPcJgSkvpDX7pJffBzdVH.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/913290',
		ratings: rating(7.0, 9.0, 7.4, 6.5)
	},
	{
		id: 'gremlins-1984',
		title: 'Gremlins (1984)',
		nominators: ['Dan'],
		trailerQuery: 'Gremlins 1984 official trailer',
		posterPath: '/6m0F7fsXjQvUbCZrPWcJNrjvIui.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/927',
		ratings: rating(3.2, 3.2, 3.6, 4.1)
	},
	{
		id: 'practical-magic',
		title: 'Practical Magic',
		nominators: ['Sara', 'Katrina'],
		trailerQuery: 'Practical Magic official trailer',
		posterPath: '/AwmToSgf2IL3aHv0QRVsR5KvChv.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/6435',
		ratings: null
	},
	{
		id: 'practical-magic-2',
		title: 'Practical Magic 2',
		nominators: ['Sara'],
		trailerQuery: 'Practical Magic 2 official trailer',
		posterPath: '/ogwQOLbCfncjvBhFb5l0OmQH8KC.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1302904',
		ratings: null
	},
	{
		id: 'buddy',
		title: 'Buddy',
		nominators: ['Josh R'],
		trailerQuery: 'Buddy official trailer horror movie',
		posterPath: '/szMG36D2cIxeQ7i5zRQbq0DnNDe.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1514026',
		ratings: rating(5.3, 6.7, 8.3, 3.3)
	},
	{
		id: 'resident-evil-2026',
		title: 'Resident Evil (2026)',
		nominators: ['James'],
		trailerQuery: 'Resident Evil 2026 official trailer',
		posterPath: '/i7UyjfPio0VFHB9rBUZSFyhOoM8.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1423191',
		ratings: rating(9.0, 10.0, 10.0, 10.0)
	},
	{
		id: 'talk-to-me',
		title: 'Talk to Me',
		nominators: ['James'],
		trailerQuery: 'Talk to Me official trailer',
		posterPath: '/kdPMUMJzyYAc4roD52qavX0nLIC.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1008042',
		ratings: rating(7.6, 8.9, 6.2, 3.7)
	},
	{
		id: 'other-mommy',
		title: 'Other Mommy',
		nominators: ['Aish'],
		trailerQuery: 'Other Mommy official trailer horror',
		posterPath: '/fGRNCssTRrhYZxNzykGGCoMsAVq.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/1400837',
		ratings: null
	},
	{
		id: 'american-werewolf-in-london',
		title: 'An American Werewolf in London',
		nominators: ['Katrina'],
		trailerQuery: 'An American Werewolf in London official trailer',
		posterPath: '/hVEqUASJmCQaolkKFEySCHZ8uKG.jpg',
		scaryMeterUrl: 'https://scarymeter.com/movie/814',
		ratings: rating(5.6, 5.2, 8.7, 5.5)
	}
];

export const candidateIds = new Set(candidates.map((candidate) => candidate.id));
export function posterUrl(path: string) {
	return 'https://image.tmdb.org/t/p/w500' + path;
}
export function youtubeSearchUrl(query: string) {
	return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
}
