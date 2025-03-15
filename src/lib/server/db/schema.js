import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	fullName: text('full_name'),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const quiz = sqliteTable('quiz', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title'),
	ownerId: integer('owner_id').notNull().references(()=>user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const question = sqliteTable('question', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	text: text('text'),
	quizId: integer('quiz_id')
		.notNull()
		.references(() => quiz.id)
});

export const option = sqliteTable('option', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	text: text('text'),
	questionId: integer('question_id')
		.notNull()
		.references(() => question.id),
	correct: integer('correct', { mode: 'boolean' })
});

export const quiz_attempt = sqliteTable('quiz_attempt', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	startedAt: integer('started_at', { mode: 'timestamp' }), // will be null before the start of test
	endedAt: integer('ended_at', { mode: 'timestamp' }), // will be null at the start of the test
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	quizId: integer('quiz_id')
		.notNull()
		.references(() => quiz.id),
	questionId: integer('question_id')
		.notNull()
		.references(() => question.id),
	optionId: integer('option_id') // this is the selected option
		.notNull()
		.references(() => option.id),
// @ts-ignore
}, (t) => [
		unique().on(t.quizId, t.questionId, t.userId),
]);
