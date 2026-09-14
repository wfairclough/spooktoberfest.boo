<script lang="ts">
	let { data, form } = $props();
	const nomination = $derived(form?.nomination ?? data.nomination);
</script>

<svelte:head><title>Spooktoberfest 2026 | Mayfair Theatre</title></svelte:head>

<main>
	<section class="hero" aria-labelledby="festival-title">
		<div class="stars" aria-hidden="true"></div>
		<div class="moon" aria-hidden="true"></div>
		<div class="marquee" aria-label="Spooktoberfest 2026">
			<span class="bulbs" aria-hidden="true"></span>
			<p>Mayfair Theatre presents</p>
			<h1 id="festival-title">Spooktoberfest <em>2026</em></h1>
			<div class="marquee-rule"></div>
			<span class="tagline">A frightfully good double feature</span>
		</div>
		<div class="hero-copy">
			<p class="eyebrow">One night only · October 2026</p>
			<h2>Park your broom.<br />Stay for the screams.</h2>
			<p>
				Come join us at the Mayfair Theatre for this year’s spooky cinema celebration. The marquee
				is lit, the popcorn is hot, and the program is yours to haunt.
			</p>
			<a class="ticket-button" href="#nominate">Nominate the lineup <span>↓</span></a>
		</div>
		<div class="horizon" aria-hidden="true">
			<div class="city"></div>
			<div class="cars"><i></i><i></i><i></i><i></i></div>
		</div>
	</section>

	<section class="details" aria-label="Event details">
		<div>
			<span>Where</span><strong>Mayfair Theatre</strong>
			<p>Ottawa’s favourite movie palace</p>
		</div>
		<div>
			<span>When</span><strong>October 2026</strong>
			<p>Exact date coming soon</p>
		</div>
		<div>
			<span>What</span><strong>Your dream double feature</strong>
			<p>Horror, chills, and candy</p>
		</div>
	</section>

	<section class="nomination-section" id="nominate" aria-labelledby="nominate-title">
		<div class="section-intro">
			<p class="eyebrow">The audience chooses</p>
			<h2 id="nominate-title">Name your nightmares.</h2>
			<p>
				Every great drive-in needs a double feature. Nominate the two horror movies you’d most like
				to see under the marquee.
			</p>
		</div>
		{#if nomination}
			<div class="thanks" role="status">
				<div class="thanks-icon" aria-hidden="true">✦</div>
				<p class="eyebrow">Transmission received</p>
				<h3>Thanks for nominating!</h3>
				<p>{nomination.nominatorName}, your double feature is safely in the projection booth.</p>
				<dl>
					<div>
						<dt>Feature one</dt>
						<dd>{nomination.movieOne}</dd>
					</div>
					<div>
						<dt>Feature two</dt>
						<dd>{nomination.movieTwo}</dd>
					</div>
				</dl>
				<p class="fine-print">Your picks are saved on this device. See you at the Mayfair.</p>
			</div>
		{:else}
			<form method="POST" class="nomination-form">
				<div class="form-header">
					<span class="reel" aria-hidden="true">◉</span>
					<h3>Now accepting nominations</h3>
					<p>Two titles. One glorious night.</p>
				</div>
				<div class="field">
					<label for="nominator-name"><span>01</span> Your name</label><input
						id="nominator-name"
						name="nominatorName"
						placeholder="e.g. Elvira"
						maxlength="100"
						value={form?.values?.nominatorName ?? ''}
						aria-describedby={form?.errors?.nominatorName ? 'nominator-name-error' : undefined}
						aria-invalid={form?.errors?.nominatorName ? 'true' : undefined}
					/>{#if form?.errors?.nominatorName}<p class="error" id="nominator-name-error">
							{form.errors.nominatorName}
						</p>{/if}
				</div>
				<div class="field">
					<label for="movie-one"><span>02</span> First feature</label><input
						id="movie-one"
						name="movieOne"
						placeholder="e.g. The Thing"
						value={form?.values?.movieOne ?? ''}
						aria-describedby={form?.errors?.movieOne ? 'movie-one-error' : undefined}
						aria-invalid={form?.errors?.movieOne ? 'true' : undefined}
					/>{#if form?.errors?.movieOne}<p class="error" id="movie-one-error">
							{form.errors.movieOne}
						</p>{/if}
				</div>
				<div class="field">
					<label for="movie-two"><span>03</span> Second feature</label><input
						id="movie-two"
						name="movieTwo"
						placeholder="e.g. The Lost Boys"
						value={form?.values?.movieTwo ?? ''}
						aria-describedby={form?.errors?.movieTwo ? 'movie-two-error' : undefined}
						aria-invalid={form?.errors?.movieTwo ? 'true' : undefined}
					/>{#if form?.errors?.movieTwo}<p class="error" id="movie-two-error">
							{form.errors.movieTwo}
						</p>{/if}
				</div>
				<button type="submit">Send to the projectionist <span>→</span></button>
				<p class="fine-print">One double-feature nomination per guest, saved to this browser.</p>
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
		background: #110a1c;
	}
	:global(body) {
		margin: 0;
		color: #f9e8b6;
		background: #110a1c;
		font-family: 'DM Mono', monospace;
	}
	main {
		overflow: hidden;
	}
	.hero {
		min-height: 690px;
		position: relative;
		isolation: isolate;
		padding: 64px max(5vw, 28px) 160px;
		background: radial-gradient(
			ellipse at 67% 17%,
			#8b346e 0,
			#3b1751 25%,
			#150c2b 58%,
			#0b0b21 100%
		);
	}
	.hero::after {
		content: '';
		position: absolute;
		z-index: -1;
		inset: 0;
		opacity: 0.22;
		background: repeating-linear-gradient(0deg, transparent 0 3px, #fff 3px 4px);
		pointer-events: none;
	}
	.stars {
		position: absolute;
		inset: 0;
		z-index: -1;
		opacity: 0.8;
		background-image:
			radial-gradient(#f8dfa0 1px, transparent 1.5px),
			radial-gradient(#f8dfa0 1px, transparent 1.5px);
		background-size:
			57px 57px,
			83px 83px;
		background-position:
			9px 4px,
			33px 41px;
	}
	.moon {
		position: absolute;
		z-index: -1;
		width: 275px;
		height: 275px;
		border-radius: 50%;
		right: 9%;
		top: 62px;
		background: #f7c86a;
		box-shadow:
			0 0 60px #ef8d5c,
			0 0 170px #bf396a;
		opacity: 0.9;
	}
	.moon::after {
		content: '';
		position: absolute;
		width: 63px;
		height: 63px;
		top: 42px;
		left: 46px;
		border-radius: 50%;
		background: #dfa259;
		box-shadow:
			82px 30px 0 -16px #dfa259,
			36px 124px 0 -8px #dfa259;
	}
	.marquee {
		position: relative;
		width: min(730px, 100%);
		margin: 0 auto 58px;
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
	.marquee > p {
		margin: 0;
		font-size: 0.68rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
	}
	.marquee h1 {
		margin: 2px 0 -2px;
		color: #4b1c4c;
		font-family: 'League Gothic', Impact, sans-serif;
		font-size: clamp(4rem, 11vw, 7.5rem);
		font-weight: 400;
		letter-spacing: 0.02em;
		line-height: 0.8;
		text-transform: uppercase;
		text-shadow: 2px 2px #f38b68;
	}
	.marquee h1 em {
		color: #d5495f;
		font-style: normal;
	}
	.marquee-rule {
		height: 3px;
		width: 80%;
		margin: 10px auto 7px;
		background: #e85562;
	}
	.tagline {
		font-size: 0.68rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}
	.bulbs {
		position: absolute;
		inset: 8px;
		border: 2px dotted #fcba51;
		pointer-events: none;
	}
	.hero-copy {
		width: min(520px, 100%);
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
	.hero-copy h2 {
		margin: 0 0 18px;
		color: #fff0c2;
		font-size: clamp(2.7rem, 6vw, 4.7rem);
		line-height: 0.94;
	}
	.hero-copy > p:not(.eyebrow) {
		max-width: 450px;
		color: #dac5d6;
		font-size: 0.92rem;
		line-height: 1.8;
	}
	.ticket-button,
	button {
		display: inline-flex;
		align-items: center;
		gap: 18px;
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
	.ticket-button:hover,
	button:hover {
		transform: translate(2px, 2px);
		box-shadow: 3px 3px 0 #d64e61;
	}
	.ticket-button span,
	button span {
		font-size: 1.15rem;
	}
	.horizon {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 140px;
		z-index: -1;
		background: linear-gradient(transparent, #090817 58%);
	}
	.city {
		position: absolute;
		inset: 62px 0 0;
		background: repeating-linear-gradient(
			90deg,
			#130d25 0 28px,
			transparent 28px 34px,
			#130d25 34px 66px
		);
		clip-path: polygon(
			0 42%,
			9% 42%,
			9% 17%,
			16% 17%,
			16% 57%,
			26% 57%,
			26% 3%,
			32% 3%,
			32% 45%,
			40% 45%,
			40% 23%,
			48% 23%,
			48% 57%,
			57% 57%,
			57% 0,
			63% 0,
			63% 35%,
			74% 35%,
			74% 13%,
			84% 13%,
			84% 49%,
			93% 49%,
			93% 20%,
			100% 20%,
			100% 100%,
			0 100%
		);
	}
	.cars {
		position: absolute;
		bottom: 22px;
		left: 14%;
		display: flex;
		gap: clamp(35px, 8vw, 100px);
	}
	.cars i {
		position: relative;
		width: 86px;
		height: 27px;
		border-radius: 38px 38px 6px 6px;
		background: #251a32;
		border-bottom: 5px solid #05050c;
	}
	.cars i::after {
		content: '';
		position: absolute;
		width: 12px;
		height: 12px;
		right: 9px;
		bottom: -10px;
		border-radius: 50%;
		background: #05050c;
		box-shadow: -53px 0 #05050c;
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
	.details span,
	dt {
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
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: 1.25rem;
		font-weight: 400;
	}
	.details p {
		margin: 0;
		color: #a998ad;
		font-size: 0.7rem;
		line-height: 1.5;
	}
	.nomination-section {
		display: grid;
		grid-template-columns: minmax(250px, 0.85fr) minmax(380px, 1fr);
		gap: clamp(45px, 9vw, 150px);
		align-items: center;
		padding: clamp(82px, 12vw, 150px) max(7vw, 28px);
		background: #110a1c;
	}
	.section-intro {
		max-width: 450px;
	}
	.section-intro h2 {
		margin: 0 0 16px;
		color: #f8e9bd;
		font-size: clamp(2.8rem, 5vw, 4.3rem);
		line-height: 0.94;
	}
	.section-intro > p:last-child {
		color: #b8a6b8;
		font-size: 0.82rem;
		line-height: 1.85;
	}
	.nomination-form,
	.thanks {
		position: relative;
		padding: 35px;
		background: #f6e2a9;
		color: #26182d;
		box-shadow:
			12px 12px 0 #8c315b,
			0 0 0 1px #e85360;
	}
	.nomination-form::before,
	.thanks::before {
		content: '';
		position: absolute;
		inset: 10px;
		border: 1px dashed #b55a62;
		pointer-events: none;
	}
	.form-header {
		position: relative;
		margin-bottom: 28px;
		text-align: center;
	}
	.reel {
		display: block;
		margin-bottom: 4px;
		color: #dd5462;
		font-size: 2rem;
		line-height: 1;
	}
	.form-header h3,
	.thanks h3 {
		margin: 0;
		color: #432040;
		font-size: 2rem;
		line-height: 1;
	}
	.form-header p,
	.thanks > p:not(.eyebrow):not(.fine-print) {
		margin: 10px 0 0;
		color: #725069;
		font-size: 0.7rem;
	}
	.field {
		position: relative;
		margin: 20px 0;
	}
	.field label {
		display: block;
		margin-bottom: 8px;
		color: #55284a;
		font-size: 0.67rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.field label span {
		margin-right: 8px;
		color: #dc5562;
	}
	input {
		width: 100%;
		padding: 13px 4px 10px;
		color: #351c37;
		outline: none;
		border: 0;
		border-bottom: 2px solid #b85a60;
		background: transparent;
		font:
			1.2rem 'DM Serif Display',
			Georgia,
			serif;
	}
	input:focus {
		border-bottom-color: #582352;
		box-shadow: 0 2px 0 #582352;
	}
	input::placeholder {
		color: #aa8490;
	}
	input[aria-invalid='true'] {
		border-bottom-color: #ba304d;
	}
	.error {
		margin: 6px 0 0;
		color: #9d193a;
		font-size: 0.65rem;
	}
	.nomination-form button {
		width: 100%;
		justify-content: center;
		margin-top: 12px;
		background: #db5763;
		color: #fff0c2;
		box-shadow: 4px 4px 0 #56234d;
	}
	.nomination-form button:hover {
		box-shadow: 2px 2px 0 #56234d;
	}
	.fine-print {
		position: relative;
		margin: 17px 0 0;
		color: #806274;
		font-size: 0.59rem;
		line-height: 1.55;
		text-align: center;
	}
	.thanks {
		text-align: center;
	}
	.thanks-icon {
		position: relative;
		width: 56px;
		height: 56px;
		display: grid;
		place-items: center;
		margin: 0 auto 14px;
		border: 2px solid #db5763;
		border-radius: 50%;
		color: #db5763;
		font-size: 1.5rem;
	}
	.thanks .eyebrow {
		color: #bf4d60;
	}
	.thanks dl {
		position: relative;
		display: grid;
		gap: 13px;
		margin: 25px 0 0;
		padding-top: 21px;
		border-top: 1px solid #c36b67;
		text-align: left;
	}
	.thanks dl div {
		display: grid;
		grid-template-columns: 92px 1fr;
		gap: 12px;
	}
	.thanks dd {
		margin: 0;
		color: #3b2040;
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: 1.15rem;
	}
	footer {
		padding: 28px;
		color: #a190a5;
		border-top: 1px solid #452447;
		background: #0a0712;
		font-size: 0.63rem;
		letter-spacing: 0.08em;
		text-align: center;
		text-transform: uppercase;
	}
	footer span {
		color: #e66063;
	}
	@media (max-width: 720px) {
		.hero {
			min-height: 630px;
			padding-top: 43px;
		}
		.moon {
			width: 175px;
			height: 175px;
			right: -20px;
			top: 145px;
		}
		.marquee {
			margin-bottom: 52px;
		}
		.hero-copy {
			margin: 0;
		}
		.details {
			grid-template-columns: 1fr;
		}
		.details div {
			padding: 20px 10%;
		}
		.nomination-section {
			grid-template-columns: 1fr;
			padding-inline: 28px;
		}
		.nomination-form,
		.thanks {
			padding: 29px 23px;
		}
	}
</style>
