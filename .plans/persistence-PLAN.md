# Persistence Feature - Implementation Plan

## Overview

Add login, character persistence, locking, and multi-character support ("the party") while preserving the current standalone browser-only mode. Deploy to Cloudflare Pages with D1 database.

---

## Architecture Decision: Migrate to SvelteKit

**Why:** We need server-side routes for auth callbacks and API endpoints (CRUD for character sheets). SvelteKit on Cloudflare Pages gives us:

- Server routes for auth + API (via Workers)
- Prerendered static route for the standalone character sheet
- Single build, single deploy
- Native D1 binding access via `platform.env`

**What changes:**

- `@sveltejs/vite-plugin-svelte` → `@sveltejs/kit` + `@sveltejs/adapter-cloudflare`
- File-based routing under `src/routes/`
- `hooks.server.ts` for auth middleware
- `wrangler.toml` for Cloudflare config

**Static standalone mode:** The current character sheet becomes a prerendered route at `/standalone` (or can be built separately). It works exactly as today — no auth, no persistence, pure client-side.

---

## Technology Choices

| Concern         | Choice                      | Rationale                                                              |
| --------------- | --------------------------- | ---------------------------------------------------------------------- |
| Framework       | SvelteKit                   | Server routes for auth/API, same Svelte 5 components                   |
| Hosting         | Cloudflare Pages            | Free plan, Workers for API, D1 for database                            |
| Auth            | Auth.js (`@auth/sveltekit`) | Official SvelteKit integration, D1 adapter, handles sessions           |
| OAuth Provider  | GitHub                      | Simplest setup (no consent screen config), fits internal/portfolio use |
| Database        | Cloudflare D1               | Free tier (5GB), SQL, native binding in Workers                        |
| ORM             | Drizzle                     | Lightweight, Workers-compatible, type-safe, migration tooling          |
| Session Storage | D1 (via Auth.js adapter)    | Auth.js handles session table automatically                            |

### New Dependencies

```bash
# Production
npm i @sveltejs/kit @auth/sveltekit @auth/d1-adapter drizzle-orm

# Dev
npm i -D @sveltejs/adapter-cloudflare wrangler drizzle-kit @cloudflare/workers-types
```

Remove: `@sveltejs/vite-plugin-svelte` (SvelteKit handles Vite integration)

---

## Project Structure (After Migration)

```
src/
├── app.html                       # SvelteKit HTML template (replaces index.html)
├── app.css                        # Global styles (unchanged)
├── app.d.ts                       # Platform type declarations (D1 bindings)
├── hooks.server.ts                # Auth.js middleware
├── lib/
│   ├── store.svelte.ts            # CharacterStore class (refactored, no singleton)
│   ├── context.ts                 # Svelte context helpers for character instance
│   ├── components/                # All existing components (moved from src/components/)
│   │   ├── BasicInfo.svelte
│   │   ├── EssenceColumn.svelte
│   │   ├── ... (all existing)
│   │   ├── StatusBadge.svelte     # NEW: compact complete/lock status + actions
│   │   ├── Sidebar.svelte         # NEW: character list sidebar
│   │   ├── ConfirmDialog.svelte   # NEW: reusable confirmation modal
│   │   └── CharacterSheet.svelte  # NEW: extracted full sheet layout (from App.svelte)
│   ├── data/                      # All existing data files (moved from src/data/)
│   └── server/
│       ├── db.ts                  # Drizzle D1 client + schema
│       └── characters.ts          # Character CRUD operations
├── routes/
│   ├── +layout.svelte             # Root layout (sidebar for logged-in, auth state)
│   ├── +layout.server.ts          # Load session data
│   ├── +page.svelte               # Redirect to /new or last character
│   ├── standalone/
│   │   ├── +page.svelte           # Standalone character sheet (prerendered, no auth)
│   │   └── +page.ts               # export const prerender = true
│   ├── new/
│   │   └── +page.svelte           # New character sheet (dynamic)
│   ├── character/[id]/
│   │   ├── +page.svelte           # Load persisted character by ID
│   │   └── +page.server.ts        # Server load: fetch character from D1
│   ├── auth/
│   │   └── [...auth]/
│   │       └── +server.ts         # Auth.js catch-all route (handles callback, signin, signout)
│   └── api/
│       └── characters/
│           ├── +server.ts         # GET (list), POST (create/lock)
│           └── [id]/
│               └── +server.ts     # PUT (update/relock), DELETE
├── __tests__/                     # Existing tests (moved)
drizzle/
├── schema.ts                      # Drizzle schema definition
└── migrations/                    # Generated SQL migrations
wrangler.toml                      # Cloudflare bindings config
svelte.config.js                   # Updated for SvelteKit + adapter-cloudflare
```

---

## Database Schema

### D1 Tables (via Drizzle)

Auth.js manages its own tables (`users`, `accounts`, `sessions`, `verification_tokens`) via `@auth/d1-adapter`.

We add one table for character sheets:

```ts
// drizzle/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const characters = sqliteTable('characters', {
    id: text('id').primaryKey(), // UUID v4
    userId: text('user_id').notNull(), // Auth.js user ID (foreign key)
    name: text('name').notNull(), // Character name (unique per user)
    origin: text('origin'), // 'Earth Pony' | 'Pegasus' | 'Unicorn'
    cutieMark: text('cutie_mark'), // Path to cutie mark image
    description: text('description'), // Character description
    data: text('data').notNull(), // Full CharacterStore state as JSON
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```

**Notes:**

- `name` + `userId` has a unique constraint (enforced in app logic + DB unique index)
- `origin`, `cutieMark`, `description` are denormalized from `data` for sidebar display without parsing JSON
- `data` stores the full serialized CharacterStore state
- Auth.js tables are created by the D1 adapter automatically

### Migration

```sql
CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  origin TEXT,
  cutie_mark TEXT,
  description TEXT,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX idx_characters_user_name ON characters(user_id, name);
CREATE INDEX idx_characters_user ON characters(user_id);
```

---

## Character Store Refactoring

### Remove Singleton, Support Multiple Instances

Currently: `export const character = new CharacterStore()` — global singleton.

**Change to:** Factory function + Svelte context for dependency injection.

```ts
// src/lib/store.svelte.ts

export class CharacterStore {
    // ... all existing $state and $derived properties unchanged ...

    // NEW: locked state
    locked = $state(false);
    id = $state<string | null>(null); // null = new unsaved character

    // NEW: serialize to JSON
    serialize(): string {
        return JSON.stringify({
            name: this.name,
            pronouns: this.pronouns,
            description: this.description,
            origin: this.origin,
            role: this.role,
            cutieMark: this.cutieMark,
            languages: this.languages,
            movement: this.movement,
            startingPoints: this.startingPoints,
            baseEssenceStr: this.baseEssenceStr,
            baseEssenceSpd: this.baseEssenceSpd,
            baseEssenceSma: this.baseEssenceSma,
            baseEssenceSoc: this.baseEssenceSoc,
            diamondEssence: this.diamondEssence,
            goldEssence: this.goldEssence,
            earthPonyEssence: this.earthPonyEssence,
            adaptableEssence: this.adaptableEssence,
            honestyEssence: this.honestyEssence,
            kindnessSkill: this.kindnessSkill,
            skills: this.skills,
            specializations: this.specializations,
            influences: this.influences,
            hangup: this.hangup,
            backgroundBonds: this.backgroundBonds,
            generalPerks: this.generalPerks,
            generalPerkChoices: this.generalPerkChoices,
            magicRank: this.magicRank,
            masteredSpells: this.masteredSpells,
            attacks: this.attacks,
            health: this.health,
        });
    }

    // NEW: deserialize from JSON
    static fromJSON(json: string, id: string): CharacterStore {
        const store = new CharacterStore();
        const data = JSON.parse(json);
        Object.assign(store, data);
        store.id = id;
        store.locked = true; // persisted characters are always loaded as locked
        return store;
    }

    // NEW: reset to blank state
    reset(): void {
        const blank = new CharacterStore();
        // Copy all default values from blank instance
        Object.assign(this, {
            name: blank.name,
            pronouns: blank.pronouns,
            description: blank.description,
            origin: blank.origin,
            role: blank.role,
            // ... all properties
        });
        this.id = null;
        this.locked = false;
    }
}

// Keep singleton export for standalone mode backward compatibility
export const character = new CharacterStore();
```

### Context-Based Character Access

```ts
// src/lib/context.ts
import { getContext, setContext } from 'svelte';
import { CharacterStore } from './store.svelte';

const CHARACTER_KEY = Symbol('character');

export function setCharacterContext(store: CharacterStore) {
    setContext(CHARACTER_KEY, store);
}

export function getCharacterContext(): CharacterStore {
    return getContext<CharacterStore>(CHARACTER_KEY);
}
```

### Component Migration Strategy

**Phase approach — minimal changes to existing components:**

All components currently do:

```ts
import { character } from '../store.svelte';
```

**Change to:**

```ts
import { getCharacterContext } from '$lib/context';
const character = getCharacterContext();
```

This is a mechanical find-and-replace. The variable name `character` stays the same, so all template bindings (`character.name`, `bind:value={character.baseEssenceStr}`, etc.) remain untouched.

**Standalone mode:** The standalone route sets context with the singleton:

```svelte
<!-- src/routes/standalone/+page.svelte -->
<script>
    import { character } from '$lib/store.svelte';
    import { setCharacterContext } from '$lib/context';
    import CharacterSheet from '$lib/components/CharacterSheet.svelte';

    setCharacterContext(character);
</script>

<CharacterSheet />
```

**Dynamic mode:** The app route creates/loads character instances:

```svelte
<!-- src/routes/new/+page.svelte -->
<script>
    import { CharacterStore } from '$lib/store.svelte';
    import { setCharacterContext } from '$lib/context';
    import CharacterSheet from '$lib/components/CharacterSheet.svelte';

    const character = new CharacterStore();
    setCharacterContext(character);
</script>

<CharacterSheet mode="full" />
```

---

## Character Sheet States & UI

### State Machine

```
[Incomplete] → [Complete] ↔ [Locked]
                    ↓
               [Reset → Incomplete]
```

- **Incomplete**: Missing required fields. Status badge shows progress indicator.
- **Complete**: All fields filled (`isComplete === true`). Can lock (if logged in).
- **Locked**: Read-only, persisted to D1. Can unlock to edit.

### StatusBadge Component (replaces big COMPLETE stamp)

```svelte
<!-- src/lib/components/StatusBadge.svelte -->
<script lang="ts">
    import { getCharacterContext } from '$lib/context';

    let {
        mode = 'standalone',
        isLoggedIn = false,
    }: {
        mode?: 'standalone' | 'full';
        isLoggedIn?: boolean;
    } = $props();

    const character = getCharacterContext();
    let showResetConfirm = $state(false);
    let lockError = $state('');

    async function handleLock() {
        if (!character.name.trim()) {
            lockError = 'Character must have a name to lock.';
            return;
        }
        // Check name uniqueness via API
        const res = await fetch(
            `/api/characters?checkName=${encodeURIComponent(character.name.trim())}`,
        );
        const { exists, existingId } = await res.json();
        if (exists && existingId !== character.id) {
            lockError = `A character named "${character.name}" already exists. Choose a unique name.`;
            return;
        }
        lockError = '';

        // Persist
        const method = character.id ? 'PUT' : 'POST';
        const url = character.id ? `/api/characters/${character.id}` : '/api/characters';
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: character.serialize(),
        });
        const result = await response.json();
        if (!character.id) {
            character.id = result.id;
            // Update URL without reload
            history.replaceState({}, '', `/character/${result.id}`);
        }
        character.locked = true;
    }

    function handleUnlock() {
        character.locked = false;
    }

    function handleReset() {
        showResetConfirm = true;
    }

    function confirmReset() {
        character.reset();
        showResetConfirm = false;
        if (mode === 'full') {
            history.replaceState({}, '', '/new');
        }
    }
</script>

<div class="status-badge">
    {#if character.locked}
        <span class="status locked" title="Character is locked">🔒 Locked</span>
        {#if mode === 'full' && isLoggedIn}
            <button class="btn-unlock" onclick={handleUnlock}>🔓 Unlock</button>
        {/if}
    {:else if character.isComplete}
        <span class="status complete" title="Character is complete">✅ Complete</span>
        {#if mode === 'full'}
            {#if isLoggedIn}
                <button class="btn-lock" onclick={handleLock}>🔒 Lock & Save</button>
            {:else}
                <span class="login-hint">Log in to lock & save</span>
            {/if}
        {/if}
    {:else}
        <span class="status incomplete">📝 In Progress</span>
    {/if}

    <button class="btn-reset" onclick={handleReset} title="Start over">🔄 Reset</button>

    {#if lockError}
        <div class="lock-error">{lockError}</div>
    {/if}
</div>

{#if showResetConfirm}
    <!-- ConfirmDialog overlay -->
{/if}
```

**Placement:** Inside BasicInfo.svelte, replacing the current `complete-stamp` div. Positioned in the logo-area, compact and inline.

### Locked Mode Behavior

When `character.locked === true`, all inputs become read-only. Two approaches:

**Option A (recommended): CSS + attribute approach**

- Add `data-locked` attribute to the sheet container
- CSS: `[data-locked] input, [data-locked] select, [data-locked] button.essence-btn { pointer-events: none; opacity: 0.8; }`
- Modals won't open (check `locked` before opening)

**Option B: Per-component checks**

- Every input checks `disabled={character.locked}`
- More explicit but more invasive

**Recommendation:** Option A for minimal component changes. Add a few explicit checks in components that open modals (OriginModal, RoleModal, etc.).

---

## Authentication

### Auth.js Setup

```ts
// src/hooks.server.ts
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { D1Adapter } from '@auth/d1-adapter';

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => ({
    providers: [
        GitHub({
            clientId: event.platform!.env.GITHUB_CLIENT_ID,
            clientSecret: event.platform!.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    adapter: D1Adapter(event.platform!.env.DB),
    secret: event.platform!.env.AUTH_SECRET,
    trustHost: true,
    callbacks: {
        session({ session, user }) {
            // Include user ID in session for API authorization
            session.user.id = user.id;
            return session;
        },
    },
}));
```

### Session in Layouts

```ts
// src/routes/+layout.server.ts
export async function load(event) {
    const session = await event.locals.auth();
    return { session };
}
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
    import { page } from '$app/stores';
    import { signIn, signOut } from '@auth/sveltekit/client';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { children, data } = $props();
    const session = $derived(data.session);
    const isStandalone = $derived($page.url.pathname.startsWith('/standalone'));
</script>

{#if isStandalone}
    {@render children()}
{:else}
    <div class="app-layout">
        <Sidebar {session} />
        <main>
            {@render children()}
        </main>
    </div>
{/if}
```

---

## Sidebar Component

```svelte
<!-- src/lib/components/Sidebar.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { signIn, signOut } from '@auth/sveltekit/client';
    import type { Session } from '@auth/sveltekit';

    let { session }: { session: Session | null } = $props();
    let characters = $state<
        Array<{
            id: string;
            name: string;
            origin: string;
            cutieMark: string;
            description: string;
        }>
    >([]);
    let sidebarOpen = $state(false);

    // Fetch character list when logged in
    $effect(() => {
        if (session?.user) {
            fetch('/api/characters')
                .then((r) => r.json())
                .then((data) => (characters = data));
        }
    });
</script>

<button class="hamburger" onclick={() => (sidebarOpen = !sidebarOpen)}>☰</button>

<aside class="sidebar" class:open={sidebarOpen}>
    {#if session?.user}
        <div class="user-info">
            <img src={session.user.image} alt="" />
            <span>{session.user.name}</span>
            <button onclick={() => signOut()}>Sign out</button>
        </div>

        <nav class="character-list">
            <a href="/new" class="new-character">+ New Character</a>
            {#each characters as char}
                <a
                    href="/character/{char.id}"
                    class="character-item"
                    class:active={$page.params.id === char.id}
                >
                    <img src={char.cutieMark} alt="" class="mini-cutie" />
                    <div class="char-info">
                        <strong>{char.name}</strong>
                        {#if char.origin}<span class="origin">{char.origin}</span>{/if}
                        {#if char.description}<p class="desc">{char.description}</p>{/if}
                    </div>
                </a>
            {/each}
        </nav>
    {:else}
        <button class="login-btn" onclick={() => signIn('github')}> Sign in with GitHub </button>
        <p class="login-hint">Sign in to save characters</p>
    {/if}
</aside>
```

**Layout:** Sidebar is ~280px wide on desktop, hamburger menu on narrow screens. The character sheet area uses `flex: 1` to fill remaining space.

---

## API Endpoints

### `GET /api/characters` — List user's characters

```ts
// src/routes/api/characters/+server.ts
import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { characters } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET({ locals, url, platform }) {
    const session = await locals.auth();
    if (!session?.user?.id) throw error(401);

    // Name uniqueness check
    const checkName = url.searchParams.get('checkName');
    if (checkName) {
        const existing = await db(platform!.env.DB)
            .select({ id: characters.id })
            .from(characters)
            .where(eq(characters.userId, session.user.id))
            .where(eq(characters.name, checkName))
            .get();
        return json({ exists: !!existing, existingId: existing?.id ?? null });
    }

    const list = await db(platform!.env.DB)
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
```

### `POST /api/characters` — Create (first lock)

```ts
export async function POST({ locals, request, platform }) {
    const session = await locals.auth();
    if (!session?.user?.id) throw error(401);

    const data = await request.text();
    const parsed = JSON.parse(data);
    const id = crypto.randomUUID();
    const now = new Date();

    // Check name uniqueness
    const existing = await db(platform!.env.DB)
        .select({ id: characters.id })
        .from(characters)
        .where(eq(characters.userId, session.user.id))
        .where(eq(characters.name, parsed.name))
        .get();

    if (existing) throw error(409, 'Character name already exists');

    await db(platform!.env.DB)
        .insert(characters)
        .values({
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
```

### `PUT /api/characters/[id]` — Update (re-lock)

```ts
// src/routes/api/characters/[id]/+server.ts
export async function PUT({ locals, request, params, platform }) {
    const session = await locals.auth();
    if (!session?.user?.id) throw error(401);

    // Verify ownership
    const char = await db(platform!.env.DB)
        .select()
        .from(characters)
        .where(eq(characters.id, params.id))
        .where(eq(characters.userId, session.user.id))
        .get();

    if (!char) throw error(404);

    const data = await request.text();
    const parsed = JSON.parse(data);

    // Check name uniqueness (excluding self)
    const nameConflict = await db(platform!.env.DB)
        .select({ id: characters.id })
        .from(characters)
        .where(eq(characters.userId, session.user.id))
        .where(eq(characters.name, parsed.name))
        .get();

    if (nameConflict && nameConflict.id !== params.id) {
        throw error(409, 'Character name already exists');
    }

    await db(platform!.env.DB)
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
```

### `DELETE /api/characters/[id]` — Delete

```ts
export async function DELETE({ locals, params, platform }) {
    const session = await locals.auth();
    if (!session?.user?.id) throw error(401);

    const result = await db(platform!.env.DB)
        .delete(characters)
        .where(eq(characters.id, params.id))
        .where(eq(characters.userId, session.user.id));

    return json({ ok: true });
}
```

---

## Route Pages

### `/standalone` — Static standalone mode

```svelte
<!-- src/routes/standalone/+page.svelte -->
<script>
    import { CharacterStore } from '$lib/store.svelte';
    import { setCharacterContext } from '$lib/context';
    import CharacterSheet from '$lib/components/CharacterSheet.svelte';

    const character = new CharacterStore();
    setCharacterContext(character);
</script>

<CharacterSheet mode="standalone" />
```

```ts
// src/routes/standalone/+page.ts
export const prerender = true;
```

### `/new` — New character (dynamic)

```svelte
<!-- src/routes/new/+page.svelte -->
<script>
    import { CharacterStore } from '$lib/store.svelte';
    import { setCharacterContext } from '$lib/context';
    import CharacterSheet from '$lib/components/CharacterSheet.svelte';

    let { data } = $props();

    const character = new CharacterStore();
    setCharacterContext(character);
</script>

<CharacterSheet mode="full" isLoggedIn={!!data.session?.user} />
```

### `/character/[id]` — Load persisted character

```ts
// src/routes/character/[id]/+page.server.ts
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { characters } from '../../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function load({ locals, params, platform }) {
    const session = await locals.auth();
    if (!session?.user?.id) throw error(401, 'Must be logged in');

    const char = await db(platform!.env.DB)
        .select()
        .from(characters)
        .where(eq(characters.id, params.id))
        .where(eq(characters.userId, session.user.id))
        .get();

    if (!char) throw error(404, 'Character not found');

    return { characterData: char.data, characterId: char.id };
}
```

```svelte
<!-- src/routes/character/[id]/+page.svelte -->
<script>
    import { CharacterStore } from '$lib/store.svelte';
    import { setCharacterContext } from '$lib/context';
    import CharacterSheet from '$lib/components/CharacterSheet.svelte';

    let { data } = $props();

    const character = CharacterStore.fromJSON(data.characterData, data.characterId);
    setCharacterContext(character);
</script>

<CharacterSheet mode="full" isLoggedIn={true} />
```

---

## CharacterSheet Component (Extracted from App.svelte)

The current `App.svelte` becomes the root layout. The actual character sheet content moves to `CharacterSheet.svelte`:

```svelte
<!-- src/lib/components/CharacterSheet.svelte -->
<script lang="ts">
    import { getCharacterContext } from '$lib/context';
    import BasicInfo from './BasicInfo.svelte';
    import EssenceColumn from './EssenceColumn.svelte';
    // ... all other component imports

    let {
        mode = 'standalone',
        isLoggedIn = false,
    }: {
        mode?: 'standalone' | 'full';
        isLoggedIn?: boolean;
    } = $props();

    const character = getCharacterContext();
</script>

<div class="character-sheet" data-locked={character.locked || undefined}>
    <!-- Same two-page layout as current App.svelte -->
    <!-- StatusBadge replaces complete-stamp in BasicInfo -->
</div>
```

---

## Confirmation Dialogs

### Navigation guard (unsaved changes)

```svelte
<!-- In CharacterSheet or layout -->
<script>
    import { beforeNavigate } from '$app/navigation';

    beforeNavigate(({ cancel }) => {
        if (!character.locked && character.id === null && hasAnyInput(character)) {
            if (!confirm('You have unsaved changes. Leave without saving?')) {
                cancel();
            }
        }
    });
</script>
```

### Reset confirmation

```svelte
<!-- src/lib/components/ConfirmDialog.svelte -->
<script lang="ts">
    let {
        message,
        onConfirm,
        onCancel,
    }: {
        message: string;
        onConfirm: () => void;
        onCancel: () => void;
    } = $props();
</script>

<div class="modal-overlay" onclick={onCancel}>
    <div class="confirm-dialog" onclick|stopPropagation>
        <p>{message}</p>
        <div class="actions">
            <button class="btn-cancel" onclick={onCancel}>Cancel</button>
            <button class="btn-confirm" onclick={onConfirm}>Confirm</button>
        </div>
    </div>
</div>
```

---

## Delete Feature

Located in BasicInfo.svelte near the StatusBadge, visible only for locked characters in full mode:

```svelte
{#if mode === 'full' && isLoggedIn && character.locked && character.id}
    <button class="btn-delete" onclick={handleDelete}>🗑️ Delete</button>
{/if}
```

Delete flow:

1. Confirm dialog: "Delete {character.name}? This cannot be undone."
2. `DELETE /api/characters/{id}`
3. Navigate to `/new`
4. Refresh sidebar character list

---

## URL Routing Summary

| URL                 | Description                                         | Auth Required    |
| ------------------- | --------------------------------------------------- | ---------------- |
| `/standalone`       | Static standalone sheet (prerendered)               | No               |
| `/`                 | Redirect to `/new` (or last character if logged in) | No               |
| `/new`              | New character (not persisted)                       | No               |
| `/character/{uuid}` | Load persisted character                            | Yes (owner only) |
| `/auth/signin`      | Auth.js sign-in (GitHub)                            | No               |
| `/auth/signout`     | Auth.js sign-out                                    | No               |

---

## Cloudflare Configuration

### `wrangler.toml`

```toml
name = "mlp-character-sheet"
compatibility_date = "2025-01-01"

[[d1_databases]]
binding = "DB"
database_name = "mlp-characters"
database_id = "<to-be-created>"
```

### Environment Variables (Cloudflare Dashboard → Settings → Environment Variables)

```
GITHUB_CLIENT_ID=<from GitHub OAuth app>
GITHUB_CLIENT_SECRET=<from GitHub OAuth app>
AUTH_SECRET=<random 32+ char string>
```

### Manual Setup Steps (for README.md)

1. **GitHub OAuth App:**
    - Go to https://github.com/settings/developers → "New OAuth App"
    - Application name: `MLP Character Sheet`
    - Homepage URL: `https://mlp.p97.dev`
    - Authorization callback URL: `https://mlp.p97.dev/auth/callback/github`
    - Copy Client ID and Client Secret

2. **Cloudflare Pages project (Git integration):**
    - Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
    - Select the GitHub repository
    - Configure build settings:
        - **Production branch:** `main`
        - **Build command:** `npm run build`
        - **Build output directory:** `.svelte-kit/cloudflare`
        - **Environment variable:** `NODE_VERSION` = `22`
    - Under **D1 database bindings**, add: Variable `DB` → database `mlp-characters`
    - This enables automatic deploys on push to `main` and preview deploys on PRs

3. **Cloudflare D1 database:**
    - `npx wrangler d1 create mlp-characters`
    - Copy the database_id into `wrangler.toml`
    - Run Auth.js D1 migration: `npx wrangler d1 execute mlp-characters --remote --file=./drizzle/migrations/0000_init.sql`
    - Run app migration: `npx wrangler d1 execute mlp-characters --remote --file=./drizzle/migrations/0001_characters.sql`

4. **Custom domain:**
    - Cloudflare Dashboard → Pages → mlp-character-sheet → Custom domains → Add `mlp.p97.dev`
    - DNS should already point to Cloudflare (p97.dev nameservers)

5. **Environment variables:**
    - Cloudflare Dashboard → Pages → mlp-character-sheet → Settings → Environment variables
    - Add `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `AUTH_SECRET` (encrypt secrets)
    - Set for both Production and Preview environments
    - For preview deploys: consider a separate GitHub OAuth App with callback URL `https://*.mlp-character-sheet.pages.dev/auth/callback/github`

6. **Generate AUTH_SECRET:**

    ```bash
    openssl rand -base64 32
    ```

7. **Deploy:** Automatic via Git. Manual fallback:
    ```bash
    npm run build
    npx wrangler pages deploy .svelte-kit/cloudflare
    ```

---

## Implementation Phases

### Phase 1: SvelteKit Migration (No New Features) ✅

**Goal:** Same app, running on SvelteKit, deployable to Cloudflare Pages.

1. Install SvelteKit + adapter-cloudflare
2. Move files to SvelteKit structure (`src/lib/`, `src/routes/`)
3. Create `app.html` template
4. Update `svelte.config.js`
5. Update imports in all components (`../store.svelte` → `$lib/store.svelte`)
6. Create single route that renders current App.svelte content
7. Verify all tests pass
8. Verify build + local preview works

### Phase 2: Store Refactoring + Context ✅

**Goal:** CharacterStore supports multiple instances via context.

1. Add `serialize()`, `fromJSON()`, `reset()` to CharacterStore
2. Add `locked`, `id` state properties
3. Create `context.ts` helpers
4. Extract `CharacterSheet.svelte` from App.svelte
5. Update all component imports to use `getCharacterContext()`
6. Add tests for serialize/deserialize round-trip
7. Create standalone route with `prerender = true`

### Phase 3: Lock/Unlock + Status Badge + Reset ✅

**Goal:** Character state machine works (client-side only, no persistence yet).

1. Build `StatusBadge.svelte` (replaces complete-stamp)
2. Build `ConfirmDialog.svelte`
3. Implement locked mode (disable inputs via `data-locked`)
4. Add reset with confirmation
5. Integrate into BasicInfo.svelte
6. Test state transitions

### Phase 4: Auth + Database ✅

**Goal:** GitHub login works, D1 database ready.

1. Set up Auth.js with GitHub provider + D1 adapter
2. Create `hooks.server.ts`
3. Create Drizzle schema + migrations
4. Add `wrangler.toml`
5. Create `+layout.server.ts` for session loading
6. Add sign-in/sign-out buttons
7. Test auth flow locally with `wrangler pages dev`

### Phase 5: Persistence API + Sidebar ✅

**Goal:** Full CRUD for characters, sidebar navigation.

1. ✅ Build API endpoints (list, create, update, delete)
2. ✅ Build `Sidebar.svelte`
3. ✅ Create `/new`, `/character/[id]` routes
4. ✅ Wire lock/unlock to API calls
5. ✅ Implement name uniqueness check
6. ✅ Add navigation guards (unsaved changes warning)
7. ✅ Add delete with confirmation
8. ✅ Update URL on first lock (`history.replaceState`)

### Phase 6: Polish + Deploy ✅

**Goal:** Production-ready on mlp.p97.dev.

1. ✅ Responsive sidebar (hamburger on narrow screens) — slide-out menu
2. ✅ Loading states for API calls — in StatusBadge
3. ✅ Error handling for API failures — in StatusBadge
4. ✅ CI pipeline works with SvelteKit build
5. ✅ Cloudflare Pages Git integration documented in README
6. Verify on mlp.p97.dev (requires deployment)

---

## Considerations & Trade-offs

### Why Auth.js over manual OAuth?

- Handles token refresh, session management, CSRF protection
- D1 adapter creates auth tables automatically
- Less code to maintain
- Trade-off: heavier dependency, less control over session format

### Why Drizzle over raw D1 SQL?

- Type-safe queries
- Migration management
- Minimal overhead (no query builder bloat)
- Trade-off: extra dependency, but it's lightweight (~50KB)

### Why GitHub OAuth specifically?

- Simplest setup (no consent screen review process)
- Fits target audience (internal use, developer portfolio)
- Trade-off: requires users have GitHub accounts
- Can add more providers later (Auth.js makes this easy)

### Why not localStorage for persistence?

- User requirement: login + server-side persistence
- Multi-device access
- Data survives browser clearing
- Trade-off: requires backend infrastructure

### Static standalone vs. dynamic app

- Standalone route is prerendered — zero Worker invocations, CDN-served
- Can still be used as a purely offline character sheet
- Trade-off: two "versions" to maintain, but they share all components

### Locked mode via CSS (`data-locked`) vs. per-component `disabled`

- CSS approach: ~5 lines of CSS, no component changes needed
- Per-component: more explicit, better accessibility (screen readers see disabled)
- Recommendation: CSS for visual + a few explicit checks on modal-opening buttons
- Can enhance with `aria-disabled` attributes later

### Name uniqueness scope

- Per-user, not global — two users can have characters with the same name
- Enforced both client-side (pre-lock check) and server-side (DB unique index)
- On name conflict: show inline error, don't lock

### Free tier limits (Cloudflare)

- D1: 5GB storage, 25M row reads/day, 100K row writes/day — more than enough
- Workers: 100K requests/day — more than enough for internal use
- Pages: unlimited static requests, 500 builds/month
