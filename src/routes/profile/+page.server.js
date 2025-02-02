import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/** @type{import('./$types').PageServerLoad} */
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
		.select()
		.from(table.user)
		.where(eq(table.user.id, user.id));
	if (db_users.length < 1) {
		return fail(500, {message: "user not found"});
	}
	const {passwordHash, ...db_user} = {...db_users[0]};

	return {
		user: db_user,
	};
}
