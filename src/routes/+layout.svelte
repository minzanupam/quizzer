<script>
	let { children } = $props();
</script>

<nav class="top-nav">
	<a href="/">home</a>
	<a href="/login">login</a>
</nav>

{@render children()}

<style>
	.top-nav {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
</style>
