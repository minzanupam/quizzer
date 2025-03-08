import { error, redirect, fail } from "@sveltejs/kit";
import { eq, and, gt, lt, sql } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import * as auth from "$lib/server/auth";

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

	const attempts = await db.select().from(table.quiz_attempt).where(and(eq(table.quiz_attempt.quiz_id, quizId), eq(table.quiz_attempt.question_id, questionId)));

	try {
		return {
			question: questions[0].question,
			options: questions.map((x) => {
				let checked = false;
				for (let y of attempts) {
					if (y && y.option_id == x.option.id) {
						checked = true;
					}
				}
				return {
					id: x.option.id,
					text: x.option.text ?? "",
					question_id: x.option.question_id,
					checked: checked,
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
	select: async ({ request, params, cookies }) => {
		const token = auth.getSessionToken(cookies);
		const { user } = await auth.validateSessionToken(token);
		if (!user) {
			return fail(401, {message: "login required"});
		}
		const quizId = parseInt(params.quiz_id);
		if (isNaN(quizId)) {
			console.error("failed to parse quiz id with value:", params.quiz_id);
			return fail(400, {message: "failed to parse quiz id"});
		}
		const questionId = parseInt(params.question_id);
		if (isNaN(questionId)) {
			console.error("failed to parse question id with value:", params.question_id);
			return fail(400, {message: "failed to parse question id"});
		}
		const formData = await request.formData();
		const optionId = parseInt(/** @type {string} */ (formData.get("question_options")));
		if (isNaN(optionId)) {
			console.error("failed to parse option id with value:", formData.get("question_options"));
			return fail(400, {message: "failed to parse option id"});
		}
		try {
			await db
				.insert(table.quiz_attempt)
				.values({ quiz_id: quizId, question_id: questionId, option_id: optionId, user_id: user.id });
		} catch(err) {
			console.error(err);
			await db
				.update(table.quiz_attempt)
				.set({option_id: optionId})
				.where(and(eq(table.quiz_attempt.quiz_id, quizId), eq(table.quiz_attempt.question_id, questionId)));
		}
	},

	next: async ({ request, params, cookies }) => {
		const token = auth.getSessionToken(cookies);
		const { user } = await auth.validateSessionToken(token);
		if (!user) {
			return fail(401, {message: "login required"});
		}

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
			if (formData.get("question_options") != null) {
				console.error(
					"failed to parse option id: value",
					formData.get("question_options")
				);
			}
			await db
				.delete(table.quiz_attempt)
				.where(
					and(
						eq(table.quiz_attempt.quiz_id, quizId),
						eq(table.quiz_attempt.question_id, questionId)
					)
				);
		} else {
			try {
				await db.insert(table.quiz_attempt).values({
					quiz_id: quizId,
					question_id: questionId,
					option_id: optionId,
					user_id: user.id
				});
			} catch(err) {
				console.error(err);
				await db
					.update(table.quiz_attempt)
					.set({ option_id: optionId })
					.where(
						and(
							eq(table.quiz_attempt.quiz_id, quizId),
							eq(table.quiz_attempt.question_id, questionId)
						)
					);
			}
		}

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
			const questions2 = await db
				.select({ id: table.question.id })
				.from(table.question)
				.where(eq(table.question.quiz_id, quizId))
				.orderBy(sql`${table.question.id} asc`)
				.limit(1);
			const firstQuestionId = questions2[0].id;
			return redirect(302, `/quiz/attempt/${quizId}/${firstQuestionId}`);
		}
		const nextQuestionId = questions[0].id;
		return redirect(302, `/quiz/attempt/${quizId}/${nextQuestionId}`);
	},


	previous: async ({ request, params, cookies }) => {
		const token = auth.getSessionToken(cookies);
		const { user } = await auth.validateSessionToken(token);
		if (!user) {
			return fail(400, { message: "form data not found" });
		}
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
			if (formData.get("question_options") != null) {
				console.error(
					"failed to parse option id: value",
					formData.get("question_options")
				);
			}
			await db
				.delete(table.quiz_attempt)
				.where(
					and(
						eq(table.quiz_attempt.quiz_id, quizId),
						eq(table.quiz_attempt.question_id, questionId)
					)
				);
		} else {
			try {
				await db.insert(table.quiz_attempt).values({
					quiz_id: quizId,
					question_id: questionId,
					option_id: optionId,
					user_id: user.id
				});
			} catch(err) {
				console.error(err);
				await db
				.update(table.quiz_attempt)
				.set({option_id: optionId})
				.where(and(eq(table.quiz_attempt.quiz_id, quizId), eq(table.quiz_attempt.question_id, questionId)));
			}
		}

		const questions = await db
			.select({ id: table.question.id })
			.from(table.question)
			.where(
				and(
					lt(table.question.id, questionId),
					eq(table.question.quiz_id, quizId)
				)
			)
			.orderBy(sql`${table.question.id} asc`);

		if (questions.length == 0) {
			const questions2 = await db
				.select({ id: table.question.id })
				.from(table.question)
				.where(eq(table.question.quiz_id, quizId))
				.orderBy(sql`${table.question.id} asc`);
			if (questions2.length == 0) {
				console.error("previous question not found in questions:", questions2);
				error(400, {message: "previous question not found"});
			}
			const lastQuestionId = questions2[questions2.length - 1].id;
			return redirect(302, `/quiz/attempt/${quizId}/${lastQuestionId}`);
		}
		const previousQuestionId = questions[questions.length - 1].id;
		return redirect(302, `/quiz/attempt/${quizId}/${previousQuestionId}`);
	}
};
