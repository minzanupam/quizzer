import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';


/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const quizes = db.select().from(table.quiz);
		return {
			quizes: quizes,
		}
	} catch(err) {
		console.error(err);
		return error(500, "failed to fetch data from database");
	}
}

