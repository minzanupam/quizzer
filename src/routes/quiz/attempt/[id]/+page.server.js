import { error, fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, params }) {
	const quizId = parseInt(params.id);
	if (isNaN(quizId)) {
		return fail(400, { message: "failed to parse quiz" });
	}
	const token = auth.getSessionToken(cookies);
	const { session, user } = await auth.validateSessionToken(token);
	if (!user || !session) {
		return fail(401, {
			message: "user not authenticated, please login in before continuing"
		});
	}

	const rows = await db
		.select()
		.from(table.quiz)
		.innerJoin(table.question, eq(table.quiz.id, table.question.quiz_id))
		.innerJoin(table.option, eq(table.question.id, table.option.question_id))
		.where(eq(table.quiz.id, quizId));
	if (rows.length == 0) {
		return fail(404, { message: "quiz item with id not found" });
	}
	const quiz = rows[0].quiz;
	const question_rows = rows.map(x => x.question);
	const questions = [];

	const opts = rows.map(x => x.option);
	const options = Object.groupBy(opts, (x) => x.question_id)

	outer: for (let q of question_rows) {
		for (let x of questions) {
			if (q.id == x.id) {
				continue outer;
			}
		}
		questions.push({...q, options: options[q.id]});
	}

	return {
		quiz,
		questions,
	};
}
