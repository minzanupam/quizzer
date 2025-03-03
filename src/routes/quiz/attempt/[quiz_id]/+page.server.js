import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";

/** @type{import("./$types").PageServerLoad} */
export async function load({params}) {
	const quizId = parseInt(params.quiz_id);
	if (isNaN(quizId)) {
		console.error("failde to parse quiz_id with value ", quizId);
		error(400, {message: "failed to parse quiz_id"});
	}
	const quizzes = await db.select().from(table.quiz).where(eq(table.quiz.id, quizId));
	try {
		return {
			quiz: quizzes[0],
		}
	} catch(err) {
		console.error(err);
		error(400, {"message": "failed to fetch quiz"});
	}
}
