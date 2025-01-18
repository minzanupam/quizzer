import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey({autoIncrement: true}),
	full_name: text('full_name'),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: integer('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const quiz = sqliteTable('quiz', {
	id: integer('id').primaryKey({autoIncrement: true}),
	title: text('title'),
	// TODO: add other fields
});
