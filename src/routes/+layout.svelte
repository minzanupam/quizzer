<script>
	let { children, data } = $props();
</script>

<nav class="top-nav">
	<a href="/">home</a>
	<a href="/quiz/create">create new quiz</a>
	{#if data.auth}
		<a href="/profile">profile</a>
	{:else}
		<a href="/login">login</a>
	{/if}
</nav>

{@render children()}

<style>
	:root {
		color-scheme: light;
		--colorBg: light-dark(white, #18181b);
		--colorAccent: light-dark(#0f172a, #bfdbfe);
		--colorAccent2: #bfdbfe;
		background-color: var(--colorBg);
	}
	.top-nav {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
</style>
