import { error, redirect } from "@sveltejs/kit";
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

/** @type{import("./$types").Actions} */
export const actions = {
	next: async ({request, params, cookies}) => {
		const formData = await request.formData();
		console.log(formData);
		const quizId = parseInt(params.quiz_id);
		if (isNaN(quizId)) {
			console.error("failed to parse quiz id value:", params.quiz_id);
			error(400, {message: "failed to parse quiz id"});
		}
		const questionId = parseInt(params.question_id);
		if (isNaN(questionId)) {
			console.error("failed to parse question id value:", formData.get("question_id"));
			error(400, {message: "failed to parse question id"});
		}
		const optionId = parseInt(formData.get("question_options"));
		if (isNaN(optionId)) {
			console.error("failed to parse option id: value", formData.get("question_options"));
			error(400, {message: "failed to parse option id"});
		}

		console.log(questionId, optionId);
		return redirect(302, `/quiz/attempt/${quizId}/${questionId}`)
	}
}
