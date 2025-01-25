import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	try {
		var quiz_id = parseInt(params.id);
	} catch (err) {
		console.error(err);
		return error(400, 'failed to parse quiz_id');
	}
	try {
		var quizzes = await db
			.select()
			.from(table.quiz)
			.leftJoin(table.question, eq(table.quiz.id, table.question.quiz_id))
			.leftJoin(table.option, eq(table.question.id, table.option.question_id))
			.where(eq(table.quiz.id, quiz_id));
	} catch (err) {
		console.error(err);
		return fail(400, 'failed to query data from database');
	}

	let options = new Map();
	for (let i = 0; i < quizzes.length; i++) {
		const row = quizzes[i];
		if (options.has(row.question.id)) {
			options.get(row.question.id).push(row.option);
		} else {
			if (row.option) {
				options.set(row.question.id, [row.option]);
			} else {
				options.set(row.question.id, []);
			}
		}
	}

	const res = quizzes.reduce(
		/** @param {any} acc */
		(acc, x) => {
			const val = acc.questions.find((y) => y.id == x.question.id);
			if (!val) {
				x.question.options = options.get(x.question.id);
				acc.questions.push(x.question);
			}
			return {
				id: x.quiz.id,
				title: x.quiz.title,
				questions: acc.questions
			};
		},
		{
			questions: []
		}
	);

	return {
		quiz: res
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	question_add: async ({ request, params }) => {
		let quizId = 0;
		try {
			quizId = parseInt(params.id);
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'failed to parse question id' });
		}
		const formData = await request.formData();
		const question = formData.get('question');
		try {
			await db.insert(table.question).values({ quiz_id: quizId, text: question });
			return { message: 'question added' };
		} catch (err) {
			console.error(err);
			return fail(400, { message: 'question not found' });
		}
	},

	option_add: async ({ request }) => {
		const formData = await request.formData();
		const optionText = formData.get('option');
		const questionIdStr = formData.get('question_id');

		if (!optionText) {
			return fail(400, { message: 'failed to parse optionText' });
		}
		if (!questionIdStr) {
			return fail(400, { message: 'failed to parse optionText' });
		}
		const questionId = parseInt(questionIdStr);
		const option = await db
			.insert(table.option)
			.values({ text: optionText, question_id: questionId })
			.returning();
		return { message: 'option added', data: { option } };
	}
};
