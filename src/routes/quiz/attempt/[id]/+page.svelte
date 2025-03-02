<script>
	/** @type {{data: import('./$types').PageServerLoad}} */
	let { data } = $props();
</script>

<h1>Attempt the quiz</h1>

<h2>One mark per question, no negative marks</h2>
<div>
	{#each data.questions as question}
		<div>{question.text}</div>
		<form>
			<ul>
				{#each question.options as option}
					<li class="option-list-item">
						<label class="option-label">
							<input
								type="radio"
								value={option.id}
								name={question.id}
							/>{option.text}
						</label>
					</li>
				{/each}
			</ul>
		</form>
	{/each}
</div>

<style>
	.option-list-item {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}
</style>
