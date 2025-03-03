<script>
	const { data } = $props();
</script>

<h1>Question ID: {data.question?.id}</h1>
<h3>{data.question?.text}</h3>
