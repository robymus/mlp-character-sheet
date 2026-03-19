# MLP Character Sheet - Codebase Reference

## Overview

A digital character sheet for the **My Little Pony Roleplaying Game** (MLP Core Rulebook). It streamlines character generation for new players with an interactive web application. Currently level-1 only.

Supports two modes:

- **Standalone** (`/standalone`): Fully client-side, no login, no persistence — works like the original app
- **Full** (`/`, `/new`, `/character/[id]`): Login with GitHub, save/load/delete characters via Cloudflare D1

## Tech Stack

| Layer        | Technology                | Version |
| ------------ | ------------------------- | ------- |
| Framework    | SvelteKit + Svelte 5      | 2.55+   |
| Build/Deploy | adapter-cloudflare        | 7.2+    |
| Auth         | Auth.js (@auth/sveltekit) | 1.11+   |
| Database     | Cloudflare D1 (SQLite)    | -       |
| ORM          | Drizzle ORM               | 0.45+   |
| Build Tool   | Vite                      | 8.0     |
| Language     | TypeScript                | 5.9     |
| Testing      | Vitest + jsdom            | 4.1     |
| Fonts        | Fredoka, Nunito           | Google  |

## Build System

| Script         | Command                                                      | Purpose                  |
| -------------- | ------------------------------------------------------------ | ------------------------ |
| `dev`          | `vite dev`                                                   | Dev server with HMR      |
| `build`        | `vite build`                                                 | Production build         |
| `preview`      | `vite preview`                                               | Preview production build |
| `check`        | `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json` | Type checking            |
| `lint`         | `eslint .`                                                   | Run ESLint               |
| `lint:fix`     | `eslint . --fix`                                             | Auto-fix ESLint errors   |
| `format`       | `prettier --write .`                                         | Format all files         |
| `format:check` | `prettier --check .`                                         | Check formatting         |
| `test`         | `vitest run`                                                 | Run tests once           |
| `test:watch`   | `vitest`                                                     | Run tests in watch mode  |

**Config files:** `vite.config.ts`, `svelte.config.js`, `tsconfig.json`, `wrangler.toml`

## Project Structure

```
src/
├── app.html                        # SvelteKit HTML template
├── app.css                         # Global styles, CSS variables
├── app.d.ts                        # Platform type declarations (Cloudflare env)
├── hooks.server.ts                 # Auth.js middleware (GitHub OAuth, D1 adapter)
├── lib/
│   ├── store.svelte.ts             # CharacterStore class (state, serialization, lock/reset)
│   ├── context.ts                  # Svelte context helpers (setCharacterContext/getCharacterContext)
│   ├── server/
│   │   ├── db.ts                   # Drizzle D1 helper
│   │   └── schema.ts              # Drizzle schema (characters table)
│   ├── components/
│   │   ├── CharacterSheet.svelte   # Full sheet layout (used by all routes)
│   │   ├── BasicInfo.svelte        # Name, pronouns, origin/role selection, StatusBadge
│   │   ├── StatusBadge.svelte      # Lock/unlock/reset/delete controls
│   │   ├── ConfirmDialog.svelte    # Reusable confirmation modal
│   │   ├── Sidebar.svelte          # Character list sidebar with hamburger menu
│   │   ├── CutieMarkSelector.svelte
│   │   ├── EssenceColumn.svelte
│   │   ├── EssenceCounter.svelte
│   │   ├── GeneralPerkModal.svelte
│   │   ├── InfluenceModal.svelte
│   │   ├── Magic.svelte
│   │   ├── OriginInfluence.svelte
│   │   ├── OriginModal.svelte
│   │   ├── Perks.svelte
│   │   ├── BackgroundTraits.svelte
│   │   ├── RoleModal.svelte
│   │   ├── SkillBox.svelte
│   │   ├── SpellSelectorModal.svelte
│   │   └── Tooltip.svelte
│   └── data/                       # Static game data (perks, spells, roles, etc.)
├── routes/
│   ├── +layout.svelte              # Root layout (sidebar for non-standalone routes)
│   ├── +layout.server.ts           # Session loading
│   ├── +page.server.ts             # Redirect: logged in → last character, else → /new
│   ├── standalone/+page.svelte     # Standalone mode (/standalone)
│   ├── new/+page.svelte            # New character (/new)
│   ├── character/[id]/
│   │   ├── +page.server.ts         # Load character from D1 by ID
│   │   └── +page.svelte            # Render persisted character
│   └── api/
│       └── characters/
│           ├── +server.ts          # GET (list + name check), POST (create)
│           └── [id]/+server.ts     # PUT (update), DELETE
└── __tests__/
    ├── store.test.ts               # CharacterStore logic + serialization tests
    ├── data.test.ts                # Game data integrity tests
    └── build.test.ts               # SvelteKit build smoke tests

drizzle/
├── schema.ts                       # Re-exports from $lib/server/schema
└── migrations/
    ├── 0000_auth.sql               # Auth.js tables
    └── 0001_characters.sql         # Characters table + indexes

public/
├── logo.png, favicon.svg, icons.svg
├── cutiemarks/                     # 95+ cutie mark images
└── origins/                        # 3 origin images
```

## Architecture

### State Management

`CharacterStore` class in `$lib/store.svelte.ts` using Svelte 5 runes:

- **`$state`** for reactive properties (name, origin, role, essences, skills, locked, id)
- **`$derived`** for computed values (level)
- **Getters** for derived calculations (essence totals, skill points, health, completeness)
- **Context API**: Components get their store via `getCharacterContext()` from `$lib/context`
- **Serialization**: `serialize()` / `static fromJSON()` for persistence round-trips
- **State machine**: `[Incomplete] → [Complete] ↔ [Locked]`

### Routing

| Route                  | Mode       | Auth Required | Description                                  |
| ---------------------- | ---------- | ------------- | -------------------------------------------- |
| `/`                    | redirect   | No            | → `/new` (guest) or last character (logged in) |
| `/standalone`          | standalone | No            | Original app, no persistence                 |
| `/new`                 | full       | No (to edit)  | New character sheet                          |
| `/character/[id]`      | full       | Yes           | Load persisted character                     |
| `/api/characters`      | API        | Yes           | List characters, create, check               |
| `/api/characters/[id]` | API        | Yes           | Update, delete character                     |

### Authentication

- **Auth.js** (`@auth/sveltekit`) with GitHub OAuth provider
- Session loaded in `+layout.server.ts`, available to all routes
- `hooks.server.ts` initializes auth lazily (reads `platform.env` for D1 binding)
- Dev fallback: skips D1 adapter when not running with wrangler

### Persistence

- Characters stored in D1 with JSON `data` field containing full CharacterStore state
- Unique constraint on `(user_id, name)` — enforced at DB and API level
- Characters only persist when locked (first lock = create, subsequent locks = update)
- URL updates from `/new` to `/character/[id]` via `history.replaceState` on first save

### Locked Mode

- CSS `[data-locked]` attribute on container disables all interactive elements
- StatusBadge component handles lock/unlock/reset/delete with API calls
- Locking requires login (standalone mode hides lock controls)

### Component Architecture

```
+layout.svelte
├── Sidebar (hamburger menu, character list, auth)
└── CharacterSheet (shared by all routes)
    ├── BasicInfo (with StatusBadge, CutieMarkSelector, OriginModal, RoleModal)
    ├── OriginInfluence (with InfluenceModal)
    ├── Health/Wealth/Attack table
    ├── Stats Section (4 × EssenceColumn, each with 5-6 × SkillBox)
    ├── BackgroundTraits
    ├── Perks (with GeneralPerkModal)
    └── Magic (with SpellSelectorModal)
```

## Linting & Formatting

- **ESLint 10** flat config with typescript-eslint, eslint-plugin-svelte, prettier compat
- **Prettier 3** with Svelte plugin — 4 spaces, single quotes, trailing commas, 100 char width
- **Ignored dirs:** `dist/`, `.vite/`, `.svelte-kit/`, `.wrangler/`, `node_modules/`

## Testing

- **98 tests** across 3 test files:
    - `store.test.ts` — CharacterStore logic + serialization/reset/hasAnyInput
    - `data.test.ts` — Game data integrity
    - `build.test.ts` — SvelteKit build output verification

## Infrastructure

- **Cloudflare Workers** with `wrangler deploy` (manual deploy)
- **Cloudflare D1** SQLite database for character persistence and auth sessions
- **GitHub Actions CI** — lint, format check, type check, test, build
- **Custom domain:** mlp.p97.dev
- See README.md for deployment setup instructions

## License

UNLICENSE (public domain)
