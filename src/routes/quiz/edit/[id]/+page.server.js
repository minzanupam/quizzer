import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/** @type {import('./$types').PageServerLoad} */
export async function load({params}) {
	try {
		const quiz_id = parseInt(params.id);
		const quizs = await db.select().from(table.quiz).where(eq(table.quiz.id, quiz_id));
		return {
			quiz: quizs[0],
		}
	} catch (err) {
		console.error(err);
		return error(400, "failed to parse quiz_id") }
}

export const actions = {
	question_add: async ({request}) => {
		const formData = request.formData();
		const question = formData.get("question");
	},
	option_add: async ({request}) => {
	},
};
