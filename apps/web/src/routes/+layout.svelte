<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#110a1c" />
	<meta
		name="description"
		content="Spooktoberfest 2026 — a spooky double-feature celebration at the Mayfair Theatre."
	/>
</svelte:head>

{@render children()}
