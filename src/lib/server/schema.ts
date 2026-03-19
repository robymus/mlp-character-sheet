import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

export const characters = sqliteTable(
    'characters',
    {
        id: text('id').primaryKey(),
        userId: text('user_id').notNull(),
        name: text('name').notNull(),
        origin: text('origin'),
        cutieMark: text('cutie_mark'),
        description: text('description'),
        data: text('data').notNull(),
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    },
    (table) => [
        uniqueIndex('idx_characters_user_name').on(table.userId, table.name),
        index('idx_characters_user').on(table.userId),
    ],
);
