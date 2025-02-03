<script>
	/** @type{{data: import('./$types').PageServerData}} */
	let { data } = $props();
	let editOn = $state(false);
	let confirmLogoutDialog;
</script>

<main>
	<h1>Profile</h1>
	<div>
		{#if editOn}
			<form action="?/edit_profile" method="POST">
				<label>full name <input type="text" name="name" value={data.user?.full_name} /></label>
				<label>email <input type="text" name="email " value={data.user?.email} /></label>
				<button type="button">cancel</button>
				<button>done</button>
			</form>
		{:else}
			<div>{data.user?.full_name}</div>
			<div>{data.user?.email}</div>
			<button>edit profile</button>
			<button>change password</button>
		{/if}
	</div>
	<form action="?/logout" method="POST">
		<dialog bind:this={confirmLogoutDialog}>
			<h3>are you sure you want to logout?</h3>
			<button type="submit">Yes</button>
			<button
				onclick={() => {
					confirmLogoutDialog.close();
				}}
				type="button"
				>No
			</button>
		</dialog>
		<button
			type="button"
			onclick={() => {
				confirmLogoutDialog.showModal();
			}}
			>logout
		</button>
	</form>
</main>
