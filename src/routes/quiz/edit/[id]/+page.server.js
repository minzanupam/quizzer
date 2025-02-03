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
		return fail(400, {message: 'failed to query data from database'});
	}

	let options = new Map();
	for (let i = 0; i < quizzes.length; i++) {
		const row = quizzes[i];
		if (!row.question || !row.option) {
			continue;
		}
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
			if (JSON.stringify(acc) == '{}') {
				acc = {
					id: x.quiz.id,
					title: x.quiz.title,
					questions: [],
				}
			}
			if (!x.question) {
				return acc;
			}
			const val = acc.questions.find(/** @param {{id: number}} y */ (y) => y.id == x.question?.id);
			if (!val) {
				// @ts-ignore
				// I like mutating object and not the spread operation
				x.question.options = options.get(x.question.id);
				acc.questions.push(x.question);
				// @ts-check
			}
			return acc;
		},
		{}
	);

	return {
		quiz: res
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	question_add: async ({ request, params }) => {
		let quizId = parseInt(params.id);
		if (isNaN(quizId)) {
			console.erorr("invalid quiz id");
			return fail(400, {message: "invalid quiz id"});
		}
		const formData = await request.formData();
		const question = formData.get('question');
		if (!qusetion) {
			console.erorr("question is empty");
			return fail(400, {message: "question is empty"});
		}
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
		const questionId = parseInt(formData.get('question_id'));

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
		const optionText = formData.get('option');
		const questionId = parseInt(formData.get('question_id'));
		const optionId = parseInt(formData.get('option_id'));

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
			await db
				.update(table.option)
				.set({text: optionText})
				.where(eq(table.option.id, optionId));
		} catch (err) {
			return fail(400, { message: 'failed to add values to the database' });
		}
	},

	option_delete: async ({request, params}) => {
		const formData = request.formData();
		const optionId = parseInt(formData.get("option_id"));
		if (isNaN(optionId)) {
			console.error('Validation error Error, option id is not a number');
			return fail(400, { message: 'failed to parse option id' });
		}
		try {
			await db.delete(table.option).where(eq(table.option.id, optionId));
		} catch(err) {
			return fail(400, { message: 'failed to delete option' });
		}
	}
};
