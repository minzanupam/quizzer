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
	@import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");
	:root {
		color-scheme: light;
		--colorBg: light-dark(white, #18181b);
		--colorAccent: light-dark(#0f172a, #bfdbfe);
		--colorAccent2: #bfdbfe;
		background-color: var(--colorBg);
	}
	:global(body) {
		margin: 0;
		padding: 0;
	}
	.top-nav {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		padding: 0.5rem;

		& a {
			color: var(--colorAccent);
			text-decoration: none;
			font-family: "Anton", Impact, sans-serif;
			font-weight: 400;
			font-style: normal;

			&::after {
				content: "";
				width: 0px;
				height: 2px;
				margin-left: 10%;
				display: block;
				background: black;
				transition: width 0.5s;
				color: transparent;
			}
			&:hover::after {
				width: 80%;
			}
		}
	}
</style>
