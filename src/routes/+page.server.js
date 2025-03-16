import { error, fail, redirect } from "@sveltejs/kit";
import { eq, ne } from "drizzle-orm";
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

	const [attempted_quizzes, unattempted_quizzes] = await Promise.all([
		db
			.select()
			.from(table.quiz_attempt)
			.innerJoin(table.quiz, eq(table.quiz_attempt.quizId, table.quiz.id))
			.innerJoin(table.user, eq(table.quiz.ownerId, table.user.id))
			.where(eq(table.quiz_attempt.userId, user.id)),
		db
			.select()
			.from(table.quiz_attempt)
			.innerJoin(table.quiz, eq(table.quiz_attempt.quizId, table.quiz.id))
			.innerJoin(table.user, eq(table.quiz.ownerId, table.user.id))
			.where(ne(table.quiz_attempt.userId, user.id))
		]);

	return {
		quizzes: {
			attempted: attempted_quizzes,
			unattempted: unattempted_quizzes
		},
		user: user
	};
}
