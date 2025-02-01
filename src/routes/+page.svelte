<script>
	let { data } = $props();
</script>

<main>
	<h1>List of Quizes</h1>

	<div>
		{#await data.quizzes}
			<div>Loading...</div>
		{:then rows}
			{#each rows as row}
				<div>
					<h3>{row.quiz.title}</h3>
					<div>from: {row.user.full_name}</div>
					<div>expires at: {row.quiz.expiresAt}</div>
					<a href={`/quiz/edit/${row.quiz.id}`}> edit </a>
				</div>
			{/each}
		{/await}
	</div>
</main>
