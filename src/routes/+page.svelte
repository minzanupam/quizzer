<script>
	let { data } = $props();
</script>

<main>
	<h1>List of Quizes</h1>

	<div>
		{#await data.quizzes}
			<div>Loading...</div>
		{:then rows}
			{#each rows as { quiz, user }}
				<div>
					<h3>{quiz.title}</h3>
					<div>from: {user.full_name}</div>
					<div>expires at: {quiz.expiresAt}</div>
					<a href={`/quiz/edit/${quiz.id}`}> edit </a>
				</div>
			{/each}
		{/await}
	</div>
</main>
