import { json, error } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { characters } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT({ locals, request, params, platform }) {
    const session = await locals.auth();
    if (!session?.user?.id) throw error(401, 'Not authenticated');

    const db = getDb(platform!.env.DB);

    // Verify ownership
    const existing = await db
        .select({ id: characters.id })
        .from(characters)
        .where(and(eq(characters.id, params.id), eq(characters.userId, session.user.id)))
        .get();

    if (!existing) throw error(404, 'Character not found');

    const data = await request.text();
    const parsed = JSON.parse(data);

    // Check name uniqueness (excluding self)
    const nameConflict = await db
        .select({ id: characters.id })
        .from(characters)
        .where(and(eq(characters.userId, session.user.id), eq(characters.name, parsed.name)))
        .get();

    if (nameConflict && nameConflict.id !== params.id) {
        throw error(409, 'Character name already exists');
    }

    await db
        .update(characters)
        .set({
            name: parsed.name,
            origin: parsed.origin || null,
            cutieMark: parsed.cutieMark || null,
            description: parsed.description || null,
            data,
            updatedAt: new Date(),
        })
        .where(eq(characters.id, params.id));

    return json({ id: params.id });
}

export async function DELETE({ locals, params, platform }) {
    const session = await locals.auth();
    if (!session?.user?.id) throw error(401, 'Not authenticated');

    const db = getDb(platform!.env.DB);

    await db
        .delete(characters)
        .where(and(eq(characters.id, params.id), eq(characters.userId, session.user.id)));

    return json({ ok: true });
}
