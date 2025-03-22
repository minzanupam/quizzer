<script>
	let { data } = $props();
</script>

<main class="page">
	<h1 class="title">List of Quizes</h1>

	{#if !data.user?.id}
		<div>
			Login and start attempting quizzes
			<a href="/login">click here to login</a>
		</div>
	{:else}
		<h2 className="attempted-heading">Attempted Quizzes</h2>
		<div class="attempted-section">
			{#each data.quizzes.attempted as { quiz, user }}
				<div>
					<h3>{quiz.title}</h3>
					<div>from: {user.fullName}</div>
					<div>expires at: {quiz.expiresAt}</div>
					<a href={`/quiz/edit/${quiz.id}`}> edit </a>
					<a href={`/quiz/attempt/${quiz.id}`}>attempt</a>
				</div>
			{/each}
		</div>
		<h2 class="unattempted-heading">Un-attempted Quizzes</h2>
		<div class="unattempted-section">
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
					No quizzes found
					<a href="/quiz/create" class="new-quiz-link" type="button"> new quizzes </a>
				</div>
			{/each}
		</div>
	{/if}
</main>

<style>
	.page {
		padding: 2rem;
		border: 1px dashed var(--colorAccent);
		margin: 2rem;
	}
	.title {
		font-family: Anton, Serif;
		font-weight: 300;
		font-size: 32px;
		text-align: center;
	}
	.attempted-section {
		padding-left: 2rem;
	}
	.unattempted-section {
		padding-left: 2rem;
	}
	.new-quiz-link {
		border: 1px dotted var(--colorAccent2);
		padding: 0.25rem;
		border-radius: 4px;
		text-decoration: none;
		color: var(--colorBg);
		font-weight: bold;
		background-color: var(--colorAccent2);
		display: block;
		text-align: center;
		font-family: roboto;
		&:active{
			color: white;
			background-color: gray;
		}
	}
</style>
