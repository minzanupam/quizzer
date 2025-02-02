import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export async function load({ request, cookies }) {
	const token = auth.getSessionToken(cookies);
	if (token == "") {
		console.error('failed to validate session, token not found');
		return fail(400, {mesasge: 'user not logged in'});
	}
	const {session, user} = await auth.validateSessionToken(token);
	if (!user) {
		return fail(400, {mesasge: 'user not logged in'});
	}
	const db_users = await db
		.select({
			id: table.user.id,
			email: table.user.email,
			fullname: table.user.full_name
		})
		.from(table.user)
		.where(eq(table.user.id, user.id));
	return {
		user: db_users[0],
	};
}
