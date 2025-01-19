import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/** @type {import('./$types).Actions} */
export const actions = {
	signup: async ({request}) => {
		let fullname = "";
		let email = "";
		let passwordHash = "";
		try {
			const formData = await request.formData();
			fullname = formData.get("full_name");
			email = formData.get("email");
			const password = formData.get("password");
			passwordHash = await hash(password, {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
		} catch(err) {
			console.error(err);
			return fail(400, "please check the form values are filled correctly");
		}
		try {
			if (fullname === "" || email === "" || passwordHash === "") {
				console.error("missing fields");
				return fail(500, "something went very wrong, please contact the website admin");
			}
			await db.insert(table.user).values({full_name: fullname, email: email, passwordHash: passwordHash});
		} catch(err) {
			console.error(err);
			return fail(409, "email already used, try logging in or clicking forget password");
		}
		return redirect(302, "/");
	}
};
