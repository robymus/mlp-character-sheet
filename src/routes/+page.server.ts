import { redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { characters } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function load({ locals, platform }) {
    let session;
    try {
        session = await locals.auth();
    } catch {
        redirect(302, '/new');
    }

    if (!session?.user?.id || !platform?.env?.DB) {
        redirect(302, '/new');
    }

    const db = getDb(platform.env.DB);

    // Find the most recently updated character
    const latest = await db
        .select({ id: characters.id })
        .from(characters)
        .where(eq(characters.userId, session.user.id))
        .orderBy(characters.updatedAt)
        .limit(1)
        .get();

    if (latest) {
        redirect(302, `/character/${latest.id}`);
    }

    redirect(302, '/new');
}
