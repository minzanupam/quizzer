<script>
	const { data } = $props();
</script>

<h1>Question ID: {data.question?.id}</h1>
<h3>{data.question?.text}</h3>

<div>
	{#each data.options as option}
		<div>
			<label>
				<input type="radio" name={`option-group-${data.question?.id}`} />
				{option.text}
			</label>
		</div>
	{/each}
	<button>deselect</button>
	<button>previous</button>
	<button>next</button>
</div>
