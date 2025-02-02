import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/** @type {import('./$types').PageServerLoad} */
export async function load({cookies, params}) {
	const quizId = parseInt(params.id);
	if (isNaN(quizId)) {
		return fail(400, {message: "failed to parse quiz"});
	}
	const token = auth.getSessionToken(cookies);
	const { session, user } = await auth.validateSessionToken(token);
	if (!user || !session) {
		return fail(401, {message: "user not authenticated, please login in before continuing"});
	}

	const quizzes = await db.select().from(table.quiz).where(eq(table.quiz.id, quizId));
	if (quizzes.length == 0) {
		return fail(404, {message: "quiz item with id not found"});
	}
	return {
	};
}
