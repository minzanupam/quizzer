<script>
	let { data } = $props();

	/** points to the current question id to which we are adding new options to */
	let cur_adding_option = $state(-1);
</script>

<h2>{data.quiz.title}</h2>
<div>
	{#each data.quiz.questions as question}
		<div>
			<h3>{question.text}</h3>
			<div>
				{#each question.options as option}
					<div>{option.text}</div>
				{:else}
					{#if cur_adding_option != question.id}
						<span>no options add...</span>
					{/if}
				{/each}
				{#if cur_adding_option == question.id}
					<form action="?/option_add" method="POST">
						<input type="number" name="question_id" hidden value={question.id} />
						<input type="text" name="option" />
						<button>add options</button>
						<button type="button" onclick={() => (cur_adding_option = -1)}>cancel</button>
					</form>
				{:else}
					<button type="button" onclick={() => (cur_adding_option = question.id)}>
						add options
					</button>
				{/if}
			</div>
		</div>
	{:else}
		<span>no questions...</span>
	{/each}
</div>

<form action="?/question_add" method="POST">
	<label> <input type="text" name="question" /></label>
	<button>add question</button>
</form>
