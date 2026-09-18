<script lang="ts">
	import { candidates, posterUrl, youtubeSearchUrl, type Candidate } from '$lib/candidates';

	let { data, form } = $props();
	let selections = $state<string[]>([]);
	const vote = $derived(form?.vote ?? data.vote);
	const pointsByRank = [3, 2, 1];

	function choose(candidate: Candidate) {
		const existingIndex = selections.indexOf(candidate.id);
		if (existingIndex >= 0) {
			selections = selections.filter((id) => id !== candidate.id);
			return;
		}
		if (selections.length < 3) selections = [...selections, candidate.id];
	}

	function rankFor(candidateId: string) {
		return selections.indexOf(candidateId) + 1;
	}

	function candidateFor(id: string) {
		return candidates.find((candidate) => candidate.id === id);
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

<svelte:head><title>Spooktoberfest 2026</title></svelte:head>

<main>
	<section class="hero" aria-labelledby="festival-title">
		<div class="marquee">
			<span class="bulbs" aria-hidden="true"></span>
			<h1 id="festival-title">Spooktoberfest <em>2026</em></h1>
		</div>
		<div class="hero-copy">
			<p class="eyebrow">The nomination booth is closed</p>
			<h2>TIME TO VOTE.</h2>
			<p>
				Cast your three votes for the movies you want to see. First pick gets 3 points, second gets
				2, and third gets 1. The overall winner will be screened at the Mayfair<sup>**</sup>, and
				runner up(s) will be streamed at Kat &amp; Will's afterwards.
			</p>
			<p class="hero-footnote">** As long as we can acquire the BluRay lol</p>
			<a class="ticket-button" href="#ballot">Cast your ballot <span>↓</span></a>
		</div>
	</section>

	<section class="details" aria-label="Event details">
		<div><span>Where</span><strong>Mayfair Theatre + Kat &amp; Will’s place</strong></div>
		<div><span>When</span><strong>October 24th</strong></div>
		<div><span>What</span><strong>A day of spooks</strong></div>
	</section>

	<section class="voting" id="ballot" aria-labelledby="ballot-title">
		<div class="voting-heading">
			<div>
				<p class="eyebrow">The voting booth</p>
				<h2 id="ballot-title">Cast your votes.</h2>
			</div>
			<p class="rules">
				Choose exactly three. Your ballot locks when submitted, and each name can submit once.
			</p>
		</div>

		{#if vote}
			<section class="locked-ballot" aria-labelledby="locked-title">
				<p class="eyebrow">Ballot locked</p>
				<h3 id="locked-title">Thanks, {vote.voterName}.</h3>
				<p>Your votes are in the projection booth.</p>
				<ol>
					{#each vote.choices as choice, index (choice)}
						{@const candidate = candidateFor(choice)}
						<li><span>{index + 1}</span>{candidate?.title} <small>{3 - index} points</small></li>
					{/each}
				</ol>
			</section>
		{:else}
			<form method="POST" action="?/vote" class="ballot">
				<div class="ballot-controls">
					<div class="field">
						<label for="voter-name">Your name</label>
						<input
							id="voter-name"
							name="voterName"
							maxlength="100"
							required
							placeholder="e.g. Elvira"
							value={form?.values?.voterName ?? ''}
							aria-invalid={form?.errors?.voterName ? 'true' : undefined}
						/>
						{#if form?.errors?.voterName}<p class="error">{form.errors.voterName}</p>{/if}
					</div>
					<div class="your-picks" aria-live="polite">
						<span>Your ballot · {selections.length}/3</span>
						<ol>
							{#each [0, 1, 2] as index (index)}
								{@const candidate = selections[index] ? candidateFor(selections[index]) : undefined}
								<li
									class:empty={!candidate}
									class:top-pick={index === 0}
									class:second-pick={index === 1}
									class:third-pick={index === 2}
								>
									<b>{index + 1}</b><span
										><small
											>{index === 0 ? 'Top pick' : index === 1 ? 'Second pick' : 'Third pick'} · {pointsByRank[
												index
											]} points</small
										>{candidate?.title ?? 'Choose a film'}</span
									>
								</li>
							{/each}
						</ol>
					</div>
					<input type="hidden" name="choiceOne" value={selections[0] ?? ''} />
					<input type="hidden" name="choiceTwo" value={selections[1] ?? ''} />
					<input type="hidden" name="choiceThree" value={selections[2] ?? ''} />
					{#if form?.errors?.choices}<p class="error">{form.errors.choices}</p>{/if}
					{#if form?.message}<p class="error">{form.message}</p>{/if}
					<button type="submit" disabled={selections.length !== 3}
						>Lock in my votes <span>→</span></button
					>
				</div>

				<div class="film-grid">
					{#each candidates as candidate (candidate.id)}
						{@const rank = rankFor(candidate.id)}
						<article class:chosen={rank > 0} class="film-card">
							<div class="film-art">
								<img src={posterUrl(candidate.posterPath)} alt={'Poster for ' + candidate.title} />
							</div>
							<div class="film-copy">
								<div class="film-title-row">
									<div>
										<h3>{candidate.title}</h3>
										<p class="release-year">{candidate.releaseYear}</p>
									</div>
									{#if rank}<span class="rank-badge">#{rank} · {4 - rank} pts</span>{/if}
								</div>
								<p class="nominators"><b>Nominated by</b> {candidate.nominators.join(', ')}</p>
								<div class="meter" aria-label={'Scary Meter ratings for ' + candidate.title}>
									{#if candidate.ratings}
										<dl>
											{#each ratingRows(candidate.ratings) as row (row.label)}
												<div>
													<dt>{row.label}</dt>
													<dd>
														<span
															class="rating-track"
															aria-label={row.label + ': ' + row.value.toFixed(1) + ' out of 10'}
															><span class="rating-fill" style:width={row.value * 10 + '%'}
															></span></span
														>
													</dd>
												</div>
											{/each}
										</dl>
									{:else}
										<span class="unrated">🌈 This is not a scary film 🦄</span>
									{/if}
								</div>
								<div class="film-links">
									<a
										href={youtubeSearchUrl(candidate.trailerQuery)}
										target="_blank"
										rel="noreferrer">Trailer ↗</a
									>
								</div>
								<button
									type="button"
									class="pick-button"
									class:selected={rank > 0}
									onclick={() => choose(candidate)}
									disabled={selections.length === 3 && !rank}
								>
									{rank
										? 'Remove pick #' + rank
										: selections.length === 3
											? 'Ballot is full'
											: 'Add to ballot'}
								</button>
							</div>
						</article>
					{/each}
				</div>
			</form>
		{/if}
	</section>
	<footer><span>Spooktoberfest</span> · Mayfair Theatre · 2026</footer>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Serif+Display:ital@0;1&family=League+Gothic&display=swap');
	:global(*) {
		box-sizing: border-box;
	}
	:global(html) {
		scroll-behavior: smooth;
		background: #10091d;
	}
	:global(body) {
		margin: 0;
		color: #f9e8b6;
		background: #10091d;
		font-family: 'DM Mono', monospace;
	}
	.hero {
		min-height: 700px;
		position: relative;
		isolation: isolate;
		padding: 64px max(6vw, 28px) 128px;
		overflow: hidden;
		background:
			linear-gradient(90deg, rgb(15 8 31 / 0.94), rgb(22 8 35 / 0.58)),
			url('/images/drive-in-voting-bg.png') center / cover;
	}
	.hero::after {
		content: '';
		position: absolute;
		z-index: -1;
		inset: 0;
		opacity: 0.15;
		pointer-events: none;
		background: repeating-linear-gradient(0deg, transparent 0 3px, #fff 3px 4px);
	}
	.marquee {
		position: relative;
		width: min(730px, 100%);
		margin: 0 auto 72px;
		padding: 24px 28px 21px;
		text-align: center;
		color: #21132d;
		background: #ffeeb9;
		border: 5px solid #e85562;
		box-shadow:
			0 0 0 7px #582152,
			0 0 32px #ff7f6b,
			0 16px 0 #31152f;
		transform: rotate(-1deg);
	}
	.marquee h1 {
		margin: 2px 0 -2px;
		color: #4b1c4c;
		font:
			400 clamp(4rem, 11vw, 7.5rem) / 0.8 'League Gothic',
			Impact,
			sans-serif;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		text-shadow: 2px 2px #f38b68;
	}
	.marquee h1 em {
		color: #d5495f;
		font-style: normal;
	}
	.bulbs {
		position: absolute;
		inset: 8px;
		border: 2px dotted #fcba51;
		pointer-events: none;
	}
	.hero-copy {
		width: min(590px, 100%);
		margin-left: max(4vw, 16px);
	}
	.eyebrow {
		margin: 0 0 11px;
		color: #ffbd5b;
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}
	h2,
	h3 {
		font-family: 'DM Serif Display', Georgia, serif;
		font-weight: 400;
	}
	.hero h2 {
		margin: 0 0 18px;
		color: #fff0c2;
		font-size: clamp(3rem, 6vw, 5rem);
		line-height: 0.93;
	}
	.hero-copy > p:not(.eyebrow) {
		max-width: 500px;
		color: #dac5d6;
		font-size: 0.92rem;
		line-height: 1.8;
	}
	.hero-copy .hero-footnote {
		margin: 11px 0 0;
		color: #ffbd5b;
		font-size: 0.64rem;
		line-height: 1.4;
	}
	.hero-copy sup {
		color: #ffbd5b;
		font-size: 0.62em;
	}
	.ticket-button,
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		margin-top: 14px;
		padding: 15px 18px;
		color: #24142f;
		border: 0;
		background: #f6c767;
		box-shadow: 5px 5px 0 #d64e61;
		font:
			500 0.72rem 'DM Mono',
			monospace;
		letter-spacing: 0.08em;
		text-decoration: none;
		text-transform: uppercase;
		transition:
			transform 0.15s,
			box-shadow 0.15s;
		cursor: pointer;
	}
	button:hover:not(:disabled),
	.ticket-button:hover {
		transform: translate(2px, 2px);
		box-shadow: 3px 3px 0 #d64e61;
	}
	button:disabled {
		opacity: 0.48;
		cursor: not-allowed;
	}
	.details {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: #e5555f;
		border-block: 1px solid #e5555f;
	}
	.details div {
		padding: 29px 7%;
		background: #1d102b;
	}
	.details span {
		display: block;
		color: #ef8e68;
		font-size: 0.63rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.details strong {
		display: block;
		margin: 7px 0;
		color: #f9e8b6;
		font:
			400 1.25rem 'DM Serif Display',
			Georgia,
			serif;
	}
	.voting {
		padding: clamp(65px, 9vw, 120px) max(5vw, 28px);
		background: #10091d;
	}
	.voting-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 42px;
		max-width: 1420px;
		margin: 0 auto 42px;
	}
	.voting-heading h2 {
		max-width: 640px;
		margin: 0;
		color: #f8e9bd;
		font-size: clamp(2.7rem, 5vw, 4.5rem);
		line-height: 0.95;
	}
	.rules {
		max-width: 325px;
		margin: 0;
		color: #d7bacd;
		font-size: 0.78rem;
		line-height: 1.7;
	}
	.ballot {
		max-width: 1420px;
		margin: auto;
	}
	.ballot-controls,
	.locked-ballot {
		position: sticky;
		top: 18px;
		z-index: 2;
		display: grid;
		grid-template-columns: minmax(190px, 0.75fr) minmax(330px, 1.4fr) auto;
		gap: 22px;
		align-items: end;
		margin-bottom: 34px;
		padding: 25px;
		color: #26182d;
		background: #f6e2a9;
		box-shadow: 9px 9px 0 #8c315b;
	}
	.field label {
		display: block;
		margin-bottom: 8px;
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}
	input {
		width: 100%;
		padding: 13px;
		color: #26182d;
		border: 2px solid #8c315b;
		border-radius: 0;
		background: #fff2c7;
		font:
			0.82rem 'DM Mono',
			monospace;
	}
	.your-picks > span {
		display: block;
		margin-bottom: 7px;
		color: #7e2858;
		font-size: 0.65rem;
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}
	.your-picks ol {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 7px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.your-picks li {
		min-height: 47px;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 9px;
		background: #ffeeb9;
		font-size: 0.67rem;
		line-height: 1.35;
	}
	.your-picks li > span {
		display: grid;
		gap: 2px;
	}
	.your-picks small {
		font-size: 0.52rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.your-picks li.empty {
		color: #8a6370;
	}
	.your-picks b {
		display: grid;
		flex: 0 0 19px;
		width: 19px;
		height: 19px;
		place-items: center;
		color: #ffeeb9;
		background: #762d5d;
		border-radius: 50%;
		font-size: 0.63rem;
	}
	.your-picks .top-pick {
		border-left: 4px solid #c89219;
		background: #fff3c6;
	}
	.your-picks .second-pick {
		border-left: 4px solid #92724b;
		background: #f9e8bf;
	}
	.your-picks .third-pick {
		border-left: 4px solid #655875;
		background: #efdeb6;
	}
	.your-picks .top-pick b {
		background: #b87b08;
	}
	.your-picks .second-pick b {
		background: #82633f;
	}
	.your-picks .third-pick b {
		background: #5e5270;
	}
	.your-picks .top-pick small {
		color: #9e6300;
		font-weight: 500;
	}
	.your-picks .second-pick small {
		color: #76542f;
	}
	.your-picks .third-pick small {
		color: #5e5270;
	}
	.ballot-controls button {
		margin: 0;
		min-height: 50px;
	}
	.error {
		grid-column: 1 / -1;
		margin: 0;
		color: #a62e4c;
		font-size: 0.72rem;
	}
	.film-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
	}
	.film-card {
		min-width: 0;
		overflow: hidden;
		border: 1px solid #64345c;
		background: #1d102b;
		box-shadow: 5px 5px 0 #3c1a41;
		transition:
			transform 0.15s,
			border-color 0.15s;
	}
	.film-card.chosen {
		border-color: #f6c767;
		transform: translateY(-4px);
		box-shadow: 5px 9px 0 #d64e61;
	}
	.film-art {
		position: relative;
		height: 300px;
		overflow: hidden;
		background: #26133b;
	}
	.film-art::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: repeating-linear-gradient(0deg, transparent 0 4px, rgb(255 255 255 / 0.08) 4px 5px);
	}
	.film-art img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
	.film-copy {
		padding: 17px;
	}
	.film-title-row {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 9px;
	}
	.film-title-row h3 {
		margin: 0;
		color: #fff0c2;
		font-size: 1.38rem;
		line-height: 1;
	}
	.release-year {
		margin: 6px 0 0;
		color: #e98b6b;
		font-size: 0.58rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.rank-badge {
		flex: 0 0 auto;
		padding: 4px 5px;
		color: #21132d;
		background: #f6c767;
		font-size: 0.56rem;
		white-space: nowrap;
	}
	.nominators {
		min-height: 35px;
		margin: 13px 0;
		color: #d5b9cb;
		font-size: 0.67rem;
		line-height: 1.5;
	}
	.nominators b {
		color: #f18d6c;
		font-weight: 500;
	}
	.meter {
		margin: 14px 0;
		padding: 10px;
		border: 1px solid #69435e;
		background: #150c27;
	}
	.meter dl {
		display: grid;
		gap: 6px;
		margin: 0;
	}
	.meter dl div {
		display: grid;
		grid-template-columns: 45px 1fr;
		align-items: center;
		min-width: 0;
	}
	.meter dt {
		color: #c7a9be;
		font-size: 0.52rem;
		letter-spacing: 0.03em;
	}
	.meter dd {
		margin: 0;
	}
	.rating-track {
		display: block;
		height: 7px;
		overflow: hidden;
		background: #332044;
		box-shadow: inset 0 0 0 1px #69435e;
	}
	.rating-fill {
		display: block;
		height: 100%;
		background: linear-gradient(90deg, #d95763, #f6c767);
		box-shadow: 0 0 8px #f6c767;
	}
	.unrated {
		color: #c7a9be;
		font-size: 0.64rem;
	}
	.film-links {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
	.film-links a {
		color: #f6c767;
		font-size: 0.63rem;
		text-underline-offset: 3px;
	}
	.pick-button {
		width: 100%;
		margin-top: 18px;
		padding: 11px;
		color: #24142f;
		background: #f6c767;
		box-shadow: 3px 3px 0 #d64e61;
		font-size: 0.62rem;
	}
	.pick-button.selected {
		color: #fff0c2;
		background: #7e2858;
		box-shadow: 3px 3px 0 #f6c767;
	}
	.locked-ballot {
		position: relative;
		display: block;
		max-width: 640px;
		margin: 0 auto;
		text-align: center;
	}
	.locked-ballot h3 {
		margin: 0;
		font-size: 2.4rem;
	}
	.locked-ballot > p:not(.eyebrow) {
		margin: 8px 0 20px;
	}
	.locked-ballot ol {
		display: grid;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
		text-align: left;
	}
	.locked-ballot li {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px;
		background: #fff0c2;
		font-size: 0.76rem;
	}
	.locked-ballot li span {
		display: grid;
		width: 23px;
		height: 23px;
		place-items: center;
		color: #fff0c2;
		background: #762d5d;
		border-radius: 50%;
	}
	.locked-ballot small {
		margin-left: auto;
		color: #7e2858;
	}
	footer {
		padding: 30px;
		color: #b68ba9;
		border-top: 1px solid #5d2b59;
		background: #0b0715;
		text-align: center;
		font-size: 0.65rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	footer span {
		color: #e66063;
	}
	@media (max-width: 1050px) {
		.film-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.ballot-controls {
			grid-template-columns: 1fr 1.6fr;
		}
		.ballot-controls button {
			grid-column: 1 / -1;
		}
	}
	@media (max-width: 720px) {
		.hero {
			min-height: 650px;
			padding-top: 42px;
		}
		.marquee {
			margin-bottom: 58px;
			padding: 20px 18px 18px;
		}
		.marquee h1 {
			font-size: clamp(2.55rem, 11vw, 3.5rem);
			letter-spacing: 0;
		}
		.hero-copy {
			margin-left: 0;
		}
		.details {
			grid-template-columns: 1fr;
		}
		.details div {
			padding: 20px 10%;
		}
		.voting-heading {
			display: block;
		}
		.rules {
			margin-top: 20px;
		}
		.ballot-controls {
			position: relative;
			display: block;
			padding: 20px;
		}
		.your-picks {
			margin-top: 20px;
		}
		.your-picks ol {
			grid-template-columns: 1fr;
		}
		.ballot-controls button {
			width: 100%;
			margin-top: 20px;
		}
		.film-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
		}
		.film-art {
			height: 210px;
		}
		.film-copy {
			padding: 13px;
		}
		.film-title-row {
			display: block;
		}
		.rank-badge {
			display: inline-block;
			margin-top: 8px;
		}
		.nominators {
			min-height: 0;
		}
		.film-links {
			display: block;
		}
		.film-links a {
			display: block;
			margin-bottom: 8px;
		}
		.pick-button {
			font-size: 0.56rem;
		}
	}
	@media (max-width: 390px) {
		.film-grid {
			grid-template-columns: 1fr;
		}
		.film-art {
			height: 180px;
		}
	}
</style>
