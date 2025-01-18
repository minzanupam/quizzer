<script>
	let { data } = $props();
</script>

<main>
	<h1>List of Quizes</h1>

	<div>
		{#await data.quizes}
			<div>Loading...</div>
		{:then quizes}
			{#each quizes as quiz}
				<div>
					<h3>{quiz.title}</h3>
				</div>
			{/each}
		{/await}
	</div>
</main>
