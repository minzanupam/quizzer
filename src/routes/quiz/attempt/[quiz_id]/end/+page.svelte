<script>
	import { page } from "$app/state";
</script>

<h1>Quiz End</h1>
<h2>You have finished the quiz what would you like to do?</h2>
<div class="selection-box">
	<a href="/">Submit and Quit</a>
	<a href={`/quiz/attempt/${page.params.quiz_id}/first_question`}
		>Go to the first question</a
	>
</div>

<style>
	.selection-box {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
