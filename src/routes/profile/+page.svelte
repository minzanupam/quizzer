<script>
	let { data } = $props();

	let editOn = $state(false);
</script>

<main>
	<h1>Profile</h1>
	<div>
		{#if editOn}
			<form action="?/edit_profile" method="POST">
				<label>full name <input type="text" name="name" value={data.user.full_name} /></label>
				<label>email <input type="text" name="email " value={data.user.email} /></label>
				<button type="button">cancel</button>
				<button>done</button>
			</form>
		{:else}
			<div>{data.user.fullname}</div>
			<div>{data.user.email}</div>
			<button>edit profile</button>
			<button>change password</button>
		{/if}
	</div>
</main>
