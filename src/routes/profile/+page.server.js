import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/** @type{import('./$types').PageServerLoad} */
export async function load({ request, cookies }) {
	const token = auth.getSessionToken(cookies);
	if (token == "") {
		console.error('user is not logged in, token is empty');
		return error(401, 'user not logged in');
	}
	const {session, user} = await auth.validateSessionToken(token);
	if (!user) {
		console.error('user not logged in, user object is empty');
		return error(400, 'user not logged in');
	}
	const db_users = await db
		.select()
		.from(table.user)
		.where(eq(table.user.id, user.id));
	if (db_users.length < 1) {
		return error(500, {message: "user not found"});
	}
	const {passwordHash, ...db_user} = {...db_users[0]};

	return {
		user: db_user,
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	logout: async ({cookies}) => {
		const token = auth.getSessionToken(cookies);
		const { session, user } = await auth.validateSessionToken(token);
		if (!session) {
			return redirect(302, "/login");
		}
		await auth.invalidateSession(session.id);
		await auth.deleteSessionTokenCookie(cookies);
		return redirect(302, "/login");
	}
};
