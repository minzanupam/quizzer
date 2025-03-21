import { eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";

export async function load({params}) {
	const quizId = parseInt(params.quiz_id);
	if (isNaN(quizId)) {
		return error(400, "quiz id is missing");
	}
	const questions = await db
		.select()
		.from(table.question)
		.orderBy(table.question.quizId)
		.where(eq(table.question.quizId, quizId));
	const questionId = questions[0].id;

	return redirect(302, `/quiz/attempt/${quizId}/${questionId}`)
}
