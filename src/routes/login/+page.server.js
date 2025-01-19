import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = /** @type {string} */ (formData.get('email'));
		const password = /** @type {string} */ (formData.get('password'));
		if (!email || !password) {
			console.error('missing fields');
			return fail(400, { message: 'missing fields' });
		}

		const users = await db.select().from(table.user).where(eq(table.user.email, email));
		const dbUser = users[0];
		if (!dbUser) {
			console.log(email);
			console.error('email not found');
			return fail(400, { message: 'email not found, please signup' });
		}
		const validPassword = await verify(dbUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			console.error('incorrect email or password');
			return fail(401, { message: 'incorrect email or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, dbUser.id);
		auth.setSessionTokenCookie(cookies, sessionToken, session.expiresAt);

		return redirect(302, '/');
	}
};
