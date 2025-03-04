<script>
	const { data } = $props();
</script>

<h1>Question ID: {data.question?.id}</h1>
<h3>{data.question?.text}</h3>

<form method="POST" action="/?next" class="question">
	{#each data.options as option}
		<label>
			<input
				type="radio"
				name={`question-${data.question?.id}`}
				value={`option-${option.id}`}
			/>
			{option.text}
		</label>
	{/each}
	<div>
		<button formaction="/?previous">previous</button>
		<button type="button">clear</button>
		<button>next</button>
	</div>
</form>

<style>
	.question {
		display: flex;
		flex-direction: column;
	}
</style>
