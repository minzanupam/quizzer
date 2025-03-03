import { error, fail, redirect } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";
import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

/** @type{import("./$types").PageServerLoad} */
async function load({ cookies, params }) {
}
