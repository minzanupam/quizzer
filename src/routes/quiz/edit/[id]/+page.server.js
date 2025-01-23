import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	try {
		const quiz_id = parseInt(params.id);
		const quizzes = await db
			.select()
			.from(table.quiz)
			.leftJoin(table.question, eq(table.quiz.id, table.question.quiz_id))
			.where(eq(table.quiz.id, quiz_id));
		const res = quizzes.reduce((acc, x) => {
			if (acc.quiz && acc.quiz.id == x.quiz.id) {
				acc.quiz.questions.push(x.question)
				return acc;
			}
			return {
				quiz: {
					id: x.quiz.id,
					title: x.quiz.title,
					questions: [x.question]
				}
			}
		}, {});
		return {
			quiz: res,
		};
	} catch (err) {
		console.error(err);
		return error(400, 'failed to parse quiz_id');
	}
}

export const actions = {
	question_add: async ({ request }) => {
		const formData = request.formData();
		const question = formData.get('question');
		await db.insert(table.question).values({ text: question }).returning();
	},
	option_add: async ({ request }) => {}
};
