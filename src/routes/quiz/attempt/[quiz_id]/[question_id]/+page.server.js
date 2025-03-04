import { error, redirect } from "@sveltejs/kit";
import { eq, and, gt, sql } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

/** @type{import("./$types").PageServerLoad} */
export async function load({ cookies, params }) {
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
			options: questions.map((x) => {
				return {
					id: x.option.id,
					text: x.option.text ?? "",
					question_id: x.option.question_id
				};
			})
		};
	} catch (err) {
		console.error(err);
		error(500, { message: "failed to fetch question records" });
	}
}

/** @type{import("./$types").Actions} */
export const actions = {
	next: async ({ request, params, cookies }) => {
		const formData = await request.formData();
		if (!formData) {
			console.error("form data not found, value:", formData);
			error(400, { message: "form data not found" });
		}
		const quizId = parseInt(params.quiz_id);
		if (isNaN(quizId)) {
			console.error("failed to parse quiz id value:", params.quiz_id);
			error(400, { message: "failed to parse quiz id" });
		}
		const questionId = parseInt(params.question_id);
		if (isNaN(questionId)) {
			console.error(
				"failed to parse question id value:",
				formData.get("question_id")
			);
			error(400, { message: "failed to parse question id" });
		}
		const optionId = parseInt(
			/** @type{string} */ (formData.get("question_options"))
		);
		if (isNaN(optionId)) {
			console.error(
				"failed to parse option id: value",
				formData.get("question_options")
			);
			error(400, { message: "failed to parse option id" });
		}

		await db.insert(table.test).values({
			quiz_id: quizId,
			question_id: questionId,
			option_id: optionId
		});

		const questions = await db
			.select({ id: table.question.id })
			.from(table.question)
			.where(
				and(
					gt(table.question.id, questionId),
					eq(table.question.quiz_id, quizId)
				)
			)
			.orderBy(sql`${table.question.id} asc`)
			.limit(1);

		if (questions.length == 0) {
			return redirect(302, `/quiz/attempt/${quizId}/end`);
		}
		const nextQuestionId = questions[0].id;
		return redirect(302, `/quiz/attempt/${quizId}/${nextQuestionId}`);
	}
};
