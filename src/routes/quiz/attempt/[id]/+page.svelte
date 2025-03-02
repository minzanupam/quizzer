<script>
	/** @type {{data: import('./$types').PageServerLoad}} */
	let { data } = $props();
</script>

<h1>Attempt the quiz</h1>

<h2>One mark per question, no negative marks</h2>
<div>
	{#each data.questions as question}
		<div>{question.text}</div>
		<ul>
			<form>
				{#each question.options as option}
					<li>
						<input
							type="radio"
							value={option.id}
							name={question.id}
						/>{option.text}
					</li>
				{/each}
			</form>
		</ul>
	{/each}
</div>
