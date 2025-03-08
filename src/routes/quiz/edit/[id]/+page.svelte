<script>
	let { data } = $props();

	/** points to the current question id to which we are adding new options to */
	let cur_adding_option = $state(-1);
	/** current editing question id adn option id respectively */
	let curedt_qid = $state(-1);
	let curedt_oid = $state(-1);

	let qedt_qid = $state(-1);
</script>

<h2>{data.quiz.title}</h2>
<div>
	{#each data.quiz.questions as question}
		<div>
			{#if qedt_qid == question.id}
				<form action="?/question_edit" method="POST">
					<input type="number" name="question_id" value={question.id} hidden />
					<input type="text" name="question" value={question.text} />
					<button class="done-button">done</button>
					<button type="button" onclick={() => (qedt_qid = -1)}>cancel</button>
					<button class="delete-button" formaction="?/question_delete">
						delete
					</button>
				</form>
			{:else}
				<h3>{question.text}</h3>
				<button onclick={() => (qedt_qid = question.id)}>edit</button>
			{/if}
			<div>
				<ol>
					{#each question.options as option}
						<li>
							<span>{option.text}</span>
							{#if curedt_qid == question.id && curedt_oid == option.id}
								<form action="?/option_edit" method="POST">
									<input
										type="number"
										name="option_id"
										hidden
										value={option.id}
									/>
									<input
										type="number"
										name="question_id"
										hidden
										value={question.id}
									/>
									<input type="text" name="option" value={option.text} />
									<button
										type="button"
										onclick={() => {
											curedt_qid = -1;
											curedt_oid = -1;
										}}>cancel</button
									>
									<button class="delete-button" formaction="?/option_delete">
										delete
									</button>
									<button class="done-button">done</button>
								</form>
							{:else}
								<button
									onclick={() => {
										curedt_qid = question.id;
										curedt_oid = option.id;
									}}>edit</button
								>
							{/if}
						</li>
					{:else}
						{#if cur_adding_option != question.id}
							<span>no options add...</span>
						{/if}
					{/each}
				</ol>
				{#if cur_adding_option == question.id}
					<form action="?/option_add" method="POST">
						<input
							type="number"
							name="question_id"
							hidden
							value={question.id}
						/>
						<input type="text" name="option" />
						<button>add options</button>
						<button type="button" onclick={() => (cur_adding_option = -1)}
							>cancel</button
						>
					</form>
				{:else}
					<button
						type="button"
						onclick={() => (cur_adding_option = question.id)}
					>
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

<style>
	.done-button {
		background-color: green;
	}
	.delete-button {
		background-color: red;
	}
</style>
