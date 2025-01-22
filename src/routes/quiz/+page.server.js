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
		const title = /** @type {string} */ (formData.get("title"));
		if (title == null || title == '') {
			console.log('title field not found');
			return fail(400, {message: 'title field not found'});
		}

		const res = await db.insert(table.quiz).values({title: title}).returning({ insertedId: table.quiz.id });
		const {insertedId} = res[0];
		return redirect(302, `/quiz/edit/${insertedId}`)
	},
};
