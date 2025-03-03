<script>
	const { data } = $props();
</script>

<a href={`/quiz/attempt/${data.quiz.id}/${data.question.id}`}>
	start quiz {data.quiz.id}
</a>
