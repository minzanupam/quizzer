<form action="?/login" method="POST" class="login-form">
	<label>email <input type="email" name="email" /> </label>
	<label>password <input type="password" name="password" /> </label>
	<a href="/signup">don't have a password, signup here</a>
	<button>login</button>
</form>

<style>
	.login-form {
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
