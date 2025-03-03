import { error } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

export async function load({ cookie, params }) {
	const quizId = parseInt(params.quiz_id);
	const questionId = parseInt(params.question_id);

	if (isNaN(quizId)) {
		error(400, { message: "failed to parse quiz id" });
	}
	if (isNaN(questionId)) {
		error(400, { message: "failed to parse quiz id" });
	}

	const questions = await db
		.select()
		.from(table.question)
		.where(
			and(
				eq(table.question.id, questionId),
				eq(table.question.quiz_id, quizId)
			)
		)
		.innerJoin(table.option, eq(table.option.question_id, questionId));

	try {
		return {
			question: questions[0].question,
			options: questions.map(x => {
				delete x.correct;
				return x.option
			}),
		};
	} catch (err) {
		console.error(err);
		error(500, { message: "failed to fetch question records" });
	}
}
