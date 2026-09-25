<script lang="ts">
	import { posterUrl, type Candidate } from '$lib/candidates';
	import type { RankedCandidate } from './+page.server';

	let { data } = $props();
	const winner = $derived(data.rankings[0] as RankedCandidate | undefined);
	const runnersUp = $derived(data.rankings.slice(1, 3) as RankedCandidate[]);
	const remainingRankings = $derived(data.rankings.slice(3) as RankedCandidate[]);

	function voteStats(film: RankedCandidate) {
		return [
			{ label: '1st choice', count: film.firstPlaceVotes, className: 'first' },
			{ label: '2nd choice', count: film.secondPlaceVotes, className: 'second' },
			{ label: '3rd choice', count: film.thirdPlaceVotes, className: 'third' }
		];
	}

	function filmMeta(film: Candidate) {
		return `${film.releaseYear} · Nominated by ${film.nominators.join(', ')}`;
	}

	function ratingRows(ratings: NonNullable<Candidate['ratings']>) {
		return [
			{ label: 'Scary', value: ratings.scary },
			{ label: 'Creepy', value: ratings.creepy },
			{ label: 'Gory', value: ratings.gory },
			{ label: 'Jumpy', value: ratings.jumpy }
		];
	}
</script>

<svelte:head><title>Spooktoberfest 2026 Results</title></svelte:head>

<main>
	<header class="hero">
		<p class="eyebrow">Spooktoberfest 2026</p>
		<h1>THE VOTES<br /><em>ARE IN.</em></h1>
		<p class="intro">I'm sorry fellow Chickens 😭</p>
	</header>

	{#if data.unavailable}
		<section class="notice">
			<h2>Results are not available in this preview.</h2>
			<p>Open this page on the deployed Cloudflare site to load the live D1 tally.</p>
		</section>
	{:else if !winner}
		<section class="notice">
			<h2>No ballots yet.</h2>
			<p>Once votes are in, the final ranking will appear here.</p>
		</section>
	{:else}
		<section class="winner" aria-labelledby="winner-title">
			<div class="winner-art">
				<img src={posterUrl(winner.posterPath)} alt={'Poster for ' + winner.title} />
			</div>
			<div class="winner-copy">
				<p class="eyebrow">#1 · The Mayfair Theatre feature</p>
				<h2 id="winner-title">{winner.title}</h2>
				<p class="meta">{filmMeta(winner)}</p>
				{#if winner.ratings}
					<div class="winner-meter" aria-label={'Scary Meter ratings for ' + winner.title}>
						<p>Scary Meter</p>
						<dl>
							{#each ratingRows(winner.ratings) as rating (rating.label)}
								<div>
									<dt>{rating.label}</dt>
									<dd><span><i style:width={rating.value * 10 + '%'}></i></span></dd>
								</div>
							{/each}
						</dl>
					</div>
				{/if}
				<p class="screening">SCREENING AT THE MAYFAIR</p>
				<div class="score">
					<strong>{winner.points}</strong><span>points</span><small
						>{winner.totalVotes} total votes</small
					>
				</div>
				<div class="vote-stats" aria-label={'Vote breakdown for ' + winner.title}>
					{#each voteStats(winner) as stat (stat.label)}
						<div class={stat.className}><strong>{stat.count}</strong><span>{stat.label}</span></div>
					{/each}
				</div>
			</div>
		</section>

		<section class="after-hours" aria-labelledby="after-hours-title">
			<div class="section-heading">
				<p class="eyebrow">#2 + #3</p>
				<h2 id="after-hours-title">AFTER-HOURS FEATURES.</h2>
				<p>Streaming at Kat &amp; Will’s after the Mayfair screening.</p>
			</div>
			<div class="runner-grid">
				{#each runnersUp as film (film.id)}
					<article class="runner-card">
						<img src={posterUrl(film.posterPath)} alt={'Poster for ' + film.title} />
						<div>
							<p class="rank">#{film.rank}</p>
							<h3>{film.title}</h3>
							<p>{filmMeta(film)}</p>
							<strong>{film.points} points · {film.totalVotes} votes</strong>
						</div>
						<div class="vote-stats compact" aria-label={'Vote breakdown for ' + film.title}>
							{#each voteStats(film) as stat (stat.label)}
								<span class={stat.className}>{stat.count} <small>{stat.label}</small></span>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		</section>

		<section class="ranking" aria-labelledby="ranking-title">
			<div class="section-heading">
				<p class="eyebrow">The complete count</p>
				<h2 id="ranking-title">RANKINGS</h2>
			</div>
			<div class="ranking-list">
				{#each remainingRankings as film (film.id)}
					<article class="ranking-row">
						<span class="rank">#{film.rank}</span>
						<img src={posterUrl(film.posterPath)} alt="" />
						<div class="film-info">
							<h3>{film.title}</h3>
							<p>{film.releaseYear}</p>
						</div>
						<div class="row-votes" aria-label={'Vote breakdown for ' + film.title}>
							{#each voteStats(film) as stat (stat.label)}
								<span class={stat.className}><b>{stat.count}</b> {stat.label}</span>
							{/each}
						</div>
						<strong class="points"
							>{film.points}<small> pts · {film.totalVotes} votes</small></strong
						>
					</article>
				{/each}
			</div>
		</section>
	{/if}
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Serif+Display:ital@0;1&family=League+Gothic&display=swap');
	:global(*) {
		box-sizing: border-box;
	}
	:global(body) {
		margin: 0;
		background: #10091d;
		color: #f9e8b6;
		font-family: 'DM Mono', monospace;
	}
	main {
		background:
			linear-gradient(rgb(16 9 29 / 0.78), rgb(16 9 29 / 0.9)),
			url('/images/drive-in-voting-bg.png') center top / cover fixed;
		overflow: hidden;
		min-height: 100vh;
	}
	.hero,
	.winner,
	.after-hours,
	.ranking,
	.notice {
		width: min(1120px, calc(100% - 40px));
		margin-inline: auto;
	}
	.hero {
		padding: 74px 0 48px;
		text-align: center;
	}
	.eyebrow {
		color: #f6bf54;
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		margin: 0 0 10px;
		text-transform: uppercase;
	}
	h1,
	h2,
	h3,
	p {
		margin-top: 0;
	}
	h1,
	h2 {
		font-family: 'League Gothic', sans-serif;
		font-weight: 400;
		letter-spacing: 0.025em;
		line-height: 0.86;
	}
	h1 {
		color: #f9e8b6;
		font-size: clamp(4.5rem, 12vw, 9rem);
		margin-bottom: 20px;
	}
	h1 em {
		color: #f35d6f;
		font-style: normal;
	}
	.intro {
		color: #d6c3d7;
		font-size: clamp(0.95rem, 2.2vw, 1.1rem);
		margin: 0;
	}
	.winner {
		align-items: stretch;
		background: #f9e8b6;
		box-shadow: 12px 12px 0 #e84c63;
		color: #210d36;
		display: grid;
		grid-template-columns: minmax(230px, 0.85fr) 1.15fr;
		margin-bottom: 110px;
	}
	.winner-art {
		background: #2a153f;
		min-height: 440px;
		overflow: hidden;
	}
	.winner-art img {
		display: block;
		height: 100%;
		object-fit: cover;
		width: 100%;
	}
	.winner-copy {
		padding: clamp(28px, 5vw, 62px);
	}
	.winner-copy .eyebrow {
		color: #a6384d;
	}
	.winner h2 {
		font-size: clamp(4rem, 8vw, 6.8rem);
		margin-bottom: 20px;
	}
	.meta,
	.section-heading > p {
		color: #634b65;
		font-size: 0.83rem;
		line-height: 1.6;
	}
	.winner-meter {
		border-top: 1px solid #c9aa84;
		margin: 25px 0 0;
		padding-top: 15px;
	}
	.winner-meter > p {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		margin-bottom: 11px;
		text-transform: uppercase;
	}
	.winner-meter dl {
		display: grid;
		gap: 8px;
		margin: 0;
	}
	.winner-meter dl > div {
		align-items: center;
		display: grid;
		gap: 8px;
		grid-template-columns: 52px 1fr;
	}
	.winner-meter dt {
		font-size: 0.67rem;
		text-transform: uppercase;
	}
	.winner-meter dd {
		margin: 0;
	}
	.winner-meter dd > span {
		background: #e6d4aa;
		display: block;
		height: 7px;
		overflow: hidden;
	}
	.winner-meter dd i {
		background: #e84c63;
		display: block;
		height: 100%;
	}
	.screening {
		background: #1f6a55;
		color: #fff2c8;
		display: inline-block;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		margin: 24px 0;
		padding: 9px 12px;
	}
	.score {
		align-items: baseline;
		display: flex;
		gap: 10px;
		margin: 2px 0 26px;
	}
	.score strong {
		color: #e84c63;
		font-family: 'League Gothic', sans-serif;
		font-size: 6.3rem;
		font-weight: 400;
		line-height: 0.7;
	}
	.score span {
		font-size: 0.75rem;
		text-transform: uppercase;
	}
	.score small {
		color: #634b65;
		font-size: 0.7rem;
		margin-left: auto;
		text-transform: uppercase;
	}
	.vote-stats {
		display: grid;
		gap: 8px;
		grid-template-columns: repeat(3, 1fr);
	}
	.vote-stats > div {
		border-left: 4px solid;
		display: grid;
		gap: 3px;
		padding-left: 9px;
	}
	.vote-stats strong {
		font-family: 'DM Serif Display', serif;
		font-size: 1.5rem;
	}
	.vote-stats span,
	.compact small {
		font-size: 0.66rem;
		text-transform: uppercase;
	}
	.first {
		border-color: #c89219 !important;
		color: #77530b;
	}
	.second {
		border-color: #92724b !important;
		color: #654e2d;
	}
	.third {
		border-color: #655875 !important;
		color: #514262;
	}
	.after-hours {
		border-top: 1px solid #6c506f;
		padding: 72px 0 110px;
	}
	.section-heading {
		margin-bottom: 30px;
	}
	.section-heading h2 {
		font-size: clamp(3.1rem, 7vw, 5rem);
		margin-bottom: 10px;
	}
	.section-heading > p:last-child {
		margin-bottom: 0;
	}
	.runner-grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(2, 1fr);
	}
	.runner-card {
		background: #29143f;
		border: 1px solid #6c506f;
		display: grid;
		grid-template-columns: 132px 1fr;
		padding: 14px;
		position: relative;
	}
	.runner-card > img {
		aspect-ratio: 2 / 3;
		height: 190px;
		object-fit: cover;
		width: 100%;
	}
	.runner-card > div:nth-child(2) {
		padding: 10px 16px;
	}
	.rank {
		color: #f6bf54;
		font-size: 0.75rem;
		margin-bottom: 10px;
	}
	.runner-card h3,
	.ranking-row h3 {
		font-family: 'DM Serif Display', serif;
		font-size: 1.45rem;
		line-height: 1.05;
		margin-bottom: 9px;
	}
	.runner-card p:not(.rank),
	.film-info p {
		color: #cfc0d3;
		font-size: 0.72rem;
		line-height: 1.45;
	}
	.runner-card > div > strong {
		color: #f6bf54;
		font-size: 0.83rem;
	}
	.vote-stats.compact {
		bottom: 14px;
		left: 14px;
		position: absolute;
		width: calc(100% - 28px);
	}
	.vote-stats.compact span {
		background: #160a25;
		border-bottom: 3px solid;
		color: #f9e8b6;
		font-size: 0.9rem;
		padding: 7px;
		text-align: center;
	}
	.ranking {
		border-top: 1px solid #6c506f;
		padding: 72px 0 100px;
	}
	.ranking-list {
		border-top: 1px solid #6c506f;
	}
	.ranking-row {
		align-items: center;
		border-bottom: 1px solid #6c506f;
		display: grid;
		gap: 20px;
		grid-template-columns: 50px 60px minmax(160px, 1fr) 1.5fr minmax(125px, 150px);
		padding: 16px 8px;
	}
	.ranking-row > .rank {
		color: #f6bf54;
		font-family: 'League Gothic', sans-serif;
		font-size: 2.5rem;
		margin: 0;
	}
	.ranking-row > img {
		aspect-ratio: 2 / 3;
		object-fit: cover;
		width: 60px;
	}
	.film-info h3 {
		margin-bottom: 5px;
	}
	.film-info p {
		margin: 0;
	}
	.row-votes {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 15px;
	}
	.row-votes span {
		border-left: 3px solid;
		font-size: 0.7rem;
		padding-left: 6px;
	}
	.row-votes b {
		font-size: 1rem;
	}
	.points {
		color: #f6bf54;
		font-family: 'DM Serif Display', serif;
		font-size: 2rem;
		text-align: right;
		white-space: nowrap;
	}
	.points small {
		color: #cfc0d3;
		font-family: 'DM Mono', monospace;
		font-size: 0.6rem;
	}
	.notice {
		background: #29143f;
		margin-bottom: 100px;
		padding: 44px;
		text-align: center;
	}
	.notice h2 {
		font-size: 3.2rem;
		margin-bottom: 10px;
	}
	.notice p {
		color: #d6c3d7;
		line-height: 1.6;
		margin: 0;
	}
	@media (max-width: 720px) {
		.hero {
			padding-top: 50px;
		}
		.winner {
			grid-template-columns: 1fr;
			margin-bottom: 72px;
		}
		.winner-art {
			max-height: 500px;
			min-height: auto;
		}
		.winner-art img {
			aspect-ratio: 2 / 2.4;
		}
		.runner-grid {
			grid-template-columns: 1fr;
		}
		.ranking-row {
			gap: 12px;
			grid-template-columns: 35px 48px 1fr 52px;
		}
		.ranking-row > img {
			width: 48px;
		}
		.row-votes {
			grid-column: 3 / 5;
		}
		.row-votes span {
			font-size: 0.62rem;
		}
		.points {
			font-size: 1.65rem;
			white-space: normal;
		}
		.points small {
			display: block;
		}
	}
</style>
