import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({request, cookies})=>{
		const token = auth.getSessionToken(cookies);
		if (token == "") {
			console.error('failed to validate session, token not found');
			return fail(400, {mesasge: 'user not logged in'});
		}
		const {session, user} = await auth.validateSessionToken(token);
		if (JSON.stringify('user') == '{}') {
			console.error('failed to validate session, user not found');
			return fail(400, {mesasge: 'user not logged in'});
		}
		const formData = await request.formData();
		const title = /** @type {string} */ (formData.get("title"));
		if (title == null || title == '') {
			console.log('title field not found');
			return fail(400, {message: 'title field not found'});
		}

		const expiresAtDate = new Date();
		expiresAtDate.setDate(expiresAtDate.getDate() + 7);

		const res = await db.insert(table.quiz)
			.values({ title: title, ownerId: user.id, expiresAt: expiresAtDate })
			.returning({ insertedId: table.quiz.id });

		const {insertedId} = res[0];
		return redirect(302, `/quiz/edit/${insertedId}`)
	},
};
