<script>
	let { data } = $props();
</script>

<h2>{data.quiz.title}</h2>
<div>
	{#each data.quiz.questions as question}
		<div>
			<h3>{question.text}</h3>
			<div>
				{#each question.options as option}
					<div>
						{option.text}
					</div>
				{/each}
				<form action="?/question/option/add">
					<input type="number" name="option" hidden value={question.id} />
					<input type="text" name="option" />
					<button>add options</button>
				</form>
			</div>
		</div>
	{/each}
</div>

<form action="?/question/add" method="POST">
	<label> <input type="text" name="question" /></label>
	<button>add question</button>
</form>
