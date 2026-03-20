import { error } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { characters } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export async function load({ locals, params, platform }) {
    const session = await locals.auth();
    if (!session?.user?.id) throw error(401, 'Must be logged in');

    const db = getDb(platform!.env.DB);

    const char = await db
        .select()
        .from(characters)
        .where(and(eq(characters.id, params.id), eq(characters.userId, session.user.id)))
        .get();

    if (!char) throw error(404, 'Character not found');

    return { characterData: char.data, characterId: char.id };
}
