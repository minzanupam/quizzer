<from action="?/add" method="POST" class="quiz-form">
	<label>title <input type="text" name="title" /> </label>
	<button>add questions</button>
</from>

<style>
	.quiz-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		max-width: 640px;

		label {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>
