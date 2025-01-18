<form method="POST" action="?/signup" class="signup-form">
	<label>full name <input type="text" name="full_name" /> </label>
	<label>email <input type="email" name="email" /> </label>
	<label>password <input type="password" name="password" /> </label>
	<button>signup</button>
</form>

<style>
	.signup-form {
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
