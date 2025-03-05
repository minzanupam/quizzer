<script>
	const { data } = $props();
</script>

<main class="page">
	<section class="sidenav">hello</section>
	<section class="question-section">
		<h1>Question {data.question?.id}.</h1>
		<div>{data.question?.text}</div>

		<form method="POST" action="?/next" class="question">
			{#each data.options as option}
				<label>
					<input type="radio" name={`question_options`} value={option.id} />
					{option.text}
				</label>
			{/each}
			<div>
				<button formaction="/?previous">previous</button>
				<button type="button">clear</button>
				<button>next</button>
			</div>
		</form>
	</section>
</main>

<style>
	.page {
		display: grid;
		grid-template-columns: 1fr 3fr;
		padding: 1rem;
	}
	.question {
		display: flex;
		flex-direction: column;
	}
</style>
