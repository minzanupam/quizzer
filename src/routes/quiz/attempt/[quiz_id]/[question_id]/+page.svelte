<script>
	import { enhance } from '$app/forms';
	import { goto } from "$app/navigation";

	const { data } = $props();
	let question_form = $state();
</script>

<main class="page">
	<section class="sidenav"></section>
	<section class="question-section">
		<div class="title-group">
			<h1>Question {data.question?.id}.</h1>
			<button>End Quiz</button>
		</div>
		<div class="question-text">{data.question?.text}</div>

		<form
			method="POST"
			action="?/select"
			class="question-box"
			bind:this={question_form}
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				return async ({ result, update }) => {
					if (result.type === 'redirect') {
						goto(result.location);
					}
				};
			}}>
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
		font-family: "Noto Serif", "times new roman", serif;
	}
	.sidenav {
		border: 2px solid var(--colorAccent);
		margin-right: 8px;
		min-height: 90vh;
	}
	.question-section {
		padding-left: 2rem;
		border: 2px solid var(--colorAccent);
		border-radius: 8px;
		margin: 1.5rem;
	}
	.title-group {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		justify-content: space-between;
		align-items: flex-start;
		padding-top: 1rem;
		padding-right: 1rem;
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
		padding: 2rem;
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
		padding-left: 8px;
		display: flex;
		max-width: 60%;
		justify-content: space-between;

		& > button {
			border: 2px solid var(--colorBg);
			border-bottom: 2px solid var(--colorAccent);
			border-right: 2px solid var(--colorAccent);
			background-color: var(--colorBg);
			padding: 0.25rem;
			width: 6rem;
			&:hover {
				border: 2px dotted var(--colorAccent);
				border-left: 2px solid var(--colorAccent);
				border-top: 2px solid var(--colorAccent);
			}
		}
	}
</style>
