import * as auth from '$lib/server/auth';

export async function load({cookies}) {
	const token = auth.getSessionToken(cookies);
	let auth_status = false;
	try {
		const {session, user} = await auth.validateSessionToken(token);
		if (user && JSON.stringify(user) != '{}') {
			auth_status = true;
		}
	} catch (err) {
		console.error(err);
	}

	return {
		auth: auth_status,
	}
}

