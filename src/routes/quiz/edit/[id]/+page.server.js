import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const quiz_id = parseInt(params.id);
	if (isNaN(quiz_id)) {
		console.error("failed to parse quiz_id with value: ", quiz_id);
		error(400, {message: "failed to parse quiz_id"});
	}
	try {
		var rows = await db
			.select()
			.from(table.quiz)
			.leftJoin(table.question, eq(table.quiz.id, table.question.quiz_id))
			.leftJoin(table.option, eq(table.question.id, table.option.question_id))
			.where(eq(table.quiz.id, quiz_id));
	} catch (err) {
		console.error(err);
		error(400, {message: 'failed to query data from database'});
	}

	if (rows.length == 0) {
		error(404, { message: "quiz item with id not found" });
	}
	const quiz = rows[0].quiz;
	const question_rows = rows.map(x => x.question).filter(x => !!x);

	if (question_rows.length == 0) {
		return {
			quiz: {...quiz, questions: []},
		}
	}

	const questions = [];
	const opts = rows.map(x => x.option).filter(x => !!x);
	const options = Object.groupBy(opts, (x) => x.question_id)

	outer: for (let q of question_rows) {
		for (let x of questions) {
			if (q.id == x.id) {
				continue outer;
			}
		}
		questions.push({...q, options: options[q.id] ?? []});
	}

	return {
		quiz: {...quiz, questions},
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	question_add: async ({ request, params, cookies }) => {
		const token = auth.getSessionToken(cookies);
		const { session, user } = await auth.validateSessionToken(token);
		if (!user || !session) {
			return fail(401, { message: 'user not authenticated, please continue after logging in' });
		}
		let quizId = parseInt(params.id);
		if (isNaN(quizId)) {
			console.error("invalid quiz id");
			return fail(400, {message: "invalid quiz id"});
		}
		const formData = await request.formData();
		const question = formData.get('question');
		if (!question) {
			console.error("question is empty");
			return fail(400, {message: "question is empty"});
		}
		db.transaction(async (tx) => {
			const quizzes = await tx.select().from(table.quiz).where(eq(table.quiz.id, quizId));
			if (quizzes.length < 1) {
				tx.rollback();
				return fail(400, {
					message: 'failed to find the respective quiz. Are you sure that the quiz was created?'
				});
			}
			const quiz = quizzes[0];
			if (quiz.ownerId != user.id) {
				tx.rollback();
				return fail(409, { message: 'only owner can edit their quiz' });
			}
			await tx.insert(table.question).values({ quiz_id: quizId, text: question.toString() });
		});
	},

	option_add: async ({ request }) => {
		const formData = await request.formData();
		const optionText = formData.get('option')?.toString();
		const questionId = parseInt(formData.get('question_id')?.toString() ?? "");

		if (!optionText) {
			return fail(400, { message: 'failed to parse optionText' });
		}
		if (isNaN(questionId)) {
			return fail(400, { message: 'failed to parse optionText' });
		}
		const option = await db
			.insert(table.option)
			.values({ text: optionText, question_id: questionId })
			.returning();
		return { message: 'option added', data: { option } };
	},

	option_edit: async ({ request }) => {
		const formData = await request.formData();
		const optionText = formData.get('option')?.toString();
		const questionId = parseInt(formData.get('question_id')?.toString() ?? "");
		const optionId = parseInt(formData.get('option_id')?.toString() ?? "");

		if (!optionText) {
			console.error('Validation error Error, option text not found');
			return fail(400, { message: 'failed to parse optionText' });
		}
		if (isNaN(questionId)) {
			console.error('Validation error Error, question id is not a number');
			return fail(400, { message: 'falied to parse question id' });
		}
		if (isNaN(optionId)) {
			console.error('Validation error Error, option id is not a number');
			return fail(400, { message: 'falied to parse question id' });
		}

		try {
			// question id not used for now as option id itself is unique
			await db.update(table.option).set({ text: optionText }).where(eq(table.option.id, optionId));
		} catch (err) {
			return fail(400, { message: 'failed to add values to the database' });
		}
	},

	option_delete: async ({ request }) => {
		const formData = await request.formData();
		const optionId = parseInt(formData.get("option_id")?.toString() ?? "");
		if (isNaN(optionId)) {
			console.error('Validation error Error, option id is not a number');
			return fail(400, { message: 'failed to parse option id' });
		}
		try {
			await db.delete(table.option).where(eq(table.option.id, optionId));
		} catch (err) {
			return fail(400, { message: 'failed to delete option' });
		}
		return {message: 'option delete successful'};
	}
};
