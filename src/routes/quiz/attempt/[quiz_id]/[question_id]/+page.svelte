<script>
	const { data } = $props();
	let question_form = $state();
</script>

<main class="page">
	<section class="sidenav">hello</section>
	<section class="question-section">
		<div class="title-group">
			<h1>Question {data.question?.id}.</h1>
			<button>End Quiz</button>
		</div>
		<div class="question-text">{data.question?.text}</div>

		<form
			method="POST"
			action="?/select"
			class="question"
			bind:this={question_form}
		>
			<div class="options-box">
				{#each data.options as option}
					<label class="question-option-box">
						<input
							type="radio"
							name="question_options"
							value={option.id}
							checked={option.checked}
							onchange={() => question_form.requestSubmit()}
						/>
						{option.text}
					</label>
				{/each}
			</div>
			<div class="button-box">
				<button formaction="?/previous">previous</button>
				<button>select</button>
				<button formaction="?/next">next</button>
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
			border: 1px solid var(--colorAccent);
			border-right: none;
		}
	}
	.question-section {
		padding-left: 2rem;
	}
	.title-group {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1rem;
	}
	.options-box {
		display: flex;
		flex-direction: column;
		border: 2px solid var(--colorAccent);
		max-width: 60%;
		border-radius: 8px;
		padding: 8px;
	}
	.question-text {
		padding-top: 2rem;
		padding-bottom: 2rem;
	}
	.question-option-box {
		padding: 0.5rem;
		position: relative;
		border-bottom: 2px solid var(--colorAccent);
		&:last-child {
			border-bottom: 0;
		}
	}
	.button-box {
		padding-top: 1rem;
		padding-bottom: 1rem;
		display: flex;
		max-width: 60%;
		justify-content: space-between;
	}
</style>
