import { error } from "@sveltejs/kit";

export async function load({cookie, params}) {
	const quizId = parseInt(params.quiz_id);
	const questionId = parseInt(params.question_id);

	if (isNaN(quizId)) {
		error(400, {message: "failed to parse quiz id"})
	}
	if (isNaN(questionId)) {
		error(400, {message: "failed to parse quiz id"})
	}

	return {
		question: {
			id: 1,
		}
	}
}
