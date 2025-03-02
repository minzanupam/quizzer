import { error, fail, redirect } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";
import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

/** @type{import("./$types").PageServerLoad} */
async function load({ cookies, params }) {
	const quizId = parseInt(params.quiz_id);
	if (isNaN(quizId)) {
		console.error("failed to parse quiz_id\nquiz_id value: ", quizId);
		error(400, {message: "failed to parse quiz_id"});
	}
	const questionId = parseInt(params.question_id);
	if (isNaN(questionId)) {
		console.error("failed to parse quiz_id\nquiz_id value: ", questionId);
		error(400, {message: "failed to parse question_id"});
	}
	const questions= await db.select().from(table.question)
		.innerJoin(table.option, eq(table.option.question_id, table.question.id))
		.where(
			and(eq(table.quiz.id, quizId), eq(table.question.id, questionId)));

	return {
		question: questions[0],
	}
}
