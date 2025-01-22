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
		// TODO: auth check
		const formData = await request.formData();
		const title = /** @type {string} */ (fromData.get("title"));
		if (title == null || title == '') {
			console.log('title field not found');
			return fail(400, {message: 'title field not found'});
		}
		const {insertedId} = await db.insert(user.quiz).values({title: title}).returning({insertedId: user.id});
		return redirect(302, `/quiz/edit/${quiz_id}`)
	},
};
