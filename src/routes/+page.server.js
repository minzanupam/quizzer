import { error, fail, redirect } from "@sveltejs/kit";
import { eq, ne, notInArray } from "drizzle-orm";
import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

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
	const { user } = await auth.validateSessionToken(token);

	if (!user) {
		return {
			quizzes: null,
			user: null
		};
	}

	const attempted_quizzes = await db
		.select()
		.from(table.quiz_attempt)
		.innerJoin(table.quiz, eq(table.quiz_attempt.quizId, table.quiz.id))
		.innerJoin(table.user, eq(table.quiz.ownerId, table.user.id))
		.groupBy(table.quiz.id)
		.where(eq(table.quiz_attempt.userId, user.id));

	const unattempted_quizzes = await db
		.select()
		.from(table.quiz)
		.innerJoin(table.user, eq(table.user.id, table.quiz.ownerId))
		.where(notInArray(table.quiz.id, attempted_quizzes.map(x => x.quiz.id)));

	return {
		quizzes: {
			attempted: attempted_quizzes,
			unattempted: unattempted_quizzes
		},
		user: user
	};
}
