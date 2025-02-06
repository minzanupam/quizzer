<script>
	/** @type {{data: import('./$types').PageServerLoad}} */
	let { data } = $props();
</script>

<h1>Attempt the quiz</h1>

<h2>One mark per qusetion, no negative marks</h2>
<div>
	{#each data.questions as question}
		<div>{question.text}</div>
		<ul>
			{#each question.options as option}
				<li>{option.text}</li>
			{/each}
		</ul>
	{/each}
</div>
