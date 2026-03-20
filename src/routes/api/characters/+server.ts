import { json, error } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { characters } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export async function GET({ locals, url, platform }) {
    const session = await locals.auth();
    if (!session?.user?.id) throw error(401, 'Not authenticated');

    const db = getDb(platform!.env.DB);

    // Name uniqueness check
    const checkName = url.searchParams.get('checkName');
    if (checkName) {
        const existing = await db
            .select({ id: characters.id })
            .from(characters)
            .where(and(eq(characters.userId, session.user.id), eq(characters.name, checkName)))
            .get();
        return json({ exists: !!existing, existingId: existing?.id ?? null });
    }

    const list = await db
        .select({
            id: characters.id,
            name: characters.name,
            origin: characters.origin,
            cutieMark: characters.cutieMark,
            description: characters.description,
        })
        .from(characters)
        .where(eq(characters.userId, session.user.id))
        .all();

    return json(list);
}

export async function POST({ locals, request, platform }) {
    const session = await locals.auth();
    if (!session?.user?.id) throw error(401, 'Not authenticated');

    const db = getDb(platform!.env.DB);
    const data = await request.text();
    const parsed = JSON.parse(data);
    const id = crypto.randomUUID();
    const now = new Date();

    // Check name uniqueness
    const existing = await db
        .select({ id: characters.id })
        .from(characters)
        .where(and(eq(characters.userId, session.user.id), eq(characters.name, parsed.name)))
        .get();

    if (existing) throw error(409, 'Character name already exists');

    await db.insert(characters).values({
        id,
        userId: session.user.id,
        name: parsed.name,
        origin: parsed.origin || null,
        cutieMark: parsed.cutieMark || null,
        description: parsed.description || null,
        data,
        createdAt: now,
        updatedAt: now,
    });

    return json({ id });
}
