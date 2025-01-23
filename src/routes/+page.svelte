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
					<a href={`/quiz/edit/${quiz.id}`}> edit </a>
				</div>
			{/each}
		{/await}
	</div>
</main>
