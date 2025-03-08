import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

async function getQuizzes() {
	const quizzes = await db
		.select()
		.from(table.quiz)
		.innerJoin(table.user, eq(table.quiz.ownerId, table.user.id));
	return quizzes;
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const token = auth.getSessionToken(cookies);
	const { session, user } = await auth.validateSessionToken(token);

	try {
		if (user) {
			return {
				quizzes: getQuizzes(),
				user: {
					id: user ? user.id : 0,
				},
			};
		} else {
			return {
				quizzes: [],
				user: {
					id: 0,
				}
			}
		}
	} catch (err) {
		console.error(err);
		return error(500, 'failed to fetch data from database');
	}
}
