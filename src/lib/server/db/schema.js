import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	full_name: text('full_name'),
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
	quiz_id: integer('quiz_id')
		.notNull()
		.references(() => quiz.id)
});

export const option = sqliteTable('option', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	text: text('text'),
	question_id: integer('question_id')
		.notNull()
		.references(() => question.id),
	correct: integer('correct', { mode: 'boolean' })
});

export const quiz_attempt = sqliteTable('quiz_attempt', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	started_at: integer('started_at', { mode: 'timestamp' }), // will be null before the start of test
	ended_at: integer('ended_at', { mode: 'timestamp' }), // will be null at the start of the test
	quiz_id: integer('quiz_id')
		.notNull()
		.references(() => quiz.id),
	question_id: integer('question_id')
		.notNull()
		.references(() => question.id),
	option_id: integer('option_id') // this is the selected option
		.notNull()
		.references(() => option.id),
}, (t) => [
		unique().on(t.quiz_id, t.question_id, t.option_id),
]);
