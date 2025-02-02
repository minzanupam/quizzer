<script>
	let { children, data } = $props();
</script>

<nav class="top-nav">
	<a href="/">home</a>
	{#if data.auth}
		<a href="/profile">profile</a>
	{:else}
		<a href="/login">login</a>
	{/if}
	<a href="/quiz/create">create new quiz</a>
</nav>

{@render children()}

<style>
	:root {
		color-scheme: dark light;
	}
	.top-nav {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
</style>
