<script>
	const { data } = $props();
</script>

<main class="page">
	<section class="sidenav">hello</section>
	<section class="question-section">
		<h1>Question {data.question?.id}.</h1>
		<div class="question-text">{data.question?.text}</div>

		<form method="POST" action="?/next" class="question">
			<div class="options-box">
				{#each data.options as option}
					<label class="question-option-box">
						<input type="radio" name={`question_options`} value={option.id} />
						{option.text}
					</label>
				{/each}
			</div>
			<div class="button-box">
				<button formaction="/?previous">previous</button>
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

		& section {
			border: 1px solid white;
		}
	}
	.question-section {
		padding-left: 2rem;
	}
	.options-box {
		display: flex;
		flex-direction: column;
		border: 1px solid white;
		max-width: 60%;
	}
	.question-text {
		padding-top: 2rem;
		padding-bottom: 2rem;
	}
	.question-option-box {
		padding: 0.5rem;
	}
	.button-box {
		padding-top: 1rem;
		padding-bottom: 1rem;
		display: flex;
		max-width: 60%;
		justify-content: space-between;
	}
</style>
