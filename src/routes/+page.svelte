<script>
	let { data } = $props();
</script>

<main>
	<h1>List of Quizes</h1>

	{#if !data.user?.id}
		<div>
			Login and start attempting quizzes
			<a href="/login">click here to login</a>
		</div>
	{:else}
		<div>
			<h2>Attempted Quizzes</h2>
			{#each data.quizzes.attempted as { quiz, user }}
				<div>
					<h3>{quiz.title}</h3>
					<div>from: {user.fullName}</div>
					<div>expires at: {quiz.expiresAt}</div>
					<a href={`/quiz/edit/${quiz.id}`}> edit </a>
					<a href={`/quiz/attempt/${quiz.id}`}>attempt</a>
				</div>
			{/each}
			<h2>Un-attempted Quizzes</h2>
			{#each data.quizzes.unattempted as { quiz, user }}
				<div>
					<h3>{quiz.title}</h3>
					<div>from: {user.fullName}</div>
					<div>expires at: {quiz.expiresAt}</div>
					<a href={`/quiz/edit/${quiz.id}`}> edit </a>
					<a href={`/quiz/attempt/${quiz.id}`}>attempt</a>
				</div>
			{:else}
				<div>
					No quizzes found <a href="/quiz/create">start creating new quizzes</a
					>
				</div>
			{/each}
		</div>
	{/if}
</main>
