# MLP Character Sheet

A digital character sheet for the **My Little Pony Roleplaying Game**. Built to help new players create level-1 characters quickly with guided selections, automatic calculations, and rule validation.

## Features

- **Origin selection** (Earth Pony, Pegasus, Unicorn) with unique bonuses and perks
- **Essence allocation** (Strength, Speed, Smarts, Social) with real-time point tracking
- **Skill system** with D2-D12 dice ranks, specializations, and per-essence point pools
- **Magic & Spellcasting** for Unicorns and characters with the Magical perk
- **25 general perks** with prerequisite checking and choices
- **18 influences** with random background bond generation
- **6 Spirit Roles** with unique role perks
- **95+ cutie marks** to choose from
- **Completeness tracking** with a visual stamp when the character is ready

Fully client-side - no server, no accounts, runs entirely in the browser.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 to start building your character.

## Scripts

| Command              | Description              |
| -------------------- | ------------------------ |
| `npm run dev`        | Start dev server         |
| `npm run build`      | Production build         |
| `npm run preview`    | Preview production build |
| `npm test`           | Run tests                |
| `npm run test:watch` | Run tests in watch mode  |
| `npm run check`      | Type check               |
| `npm run lint`       | Lint                     |
| `npm run format`     | Format code              |

## Tech Stack

- [Svelte 5](https://svelte.dev) with TypeScript
- [Vite](https://vite.dev) for build tooling
- [Vitest](https://vitest.dev) for testing

## Deployment

Deployed to **Cloudflare Pages** at [mlp.p97.dev](https://mlp.p97.dev) with automatic builds from Git.

### Prerequisites

- A [Cloudflare](https://dash.cloudflare.com) account
- A [GitHub OAuth App](https://github.com/settings/developers) for authentication
- Node.js 22+

### 1. Create a GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
    - **Application name:** `MLP Character Sheet`
    - **Homepage URL:** `https://mlp.p97.dev`
    - **Authorization callback URL:** `https://mlp.p97.dev/auth/callback/github`
3. Click **Register application**
4. Copy the **Client ID**
5. Click **Generate a new client secret** and copy it

### 2. Create a Cloudflare D1 Database

```bash
npx wrangler d1 create mlp-characters
```

Copy the `database_id` from the output into `wrangler.toml`.

Run the database migrations:

```bash
npx wrangler d1 execute mlp-characters --remote --file=./drizzle/migrations/0000_auth.sql
npx wrangler d1 execute mlp-characters --remote --file=./drizzle/migrations/0001_characters.sql
```

### 3. Create a Cloudflare Worker (connected to Git)

1. Go to **Cloudflare Dashboard → Workers & Pages → Create → Connect to Git**
2. Select your GitHub repository
3. Configure build settings:
    - **Production branch:** `main`
    - **Build command:** `npm run build`
    - **Deploy command:** `npx wrangler deploy`
    - **Node.js version:** Set environment variable `NODE_VERSION` = `22`

This enables:

- **Production deploys** on every push to `main`
- **Preview deploys** on every pull request (each PR gets a unique URL)

### 4. Configure Bindings and Secrets

In **Cloudflare Dashboard → Workers & Pages → your project → Settings**:

**Variables and Secrets** — add the following as secrets (encrypted):

| Variable               | Value                              |
| ---------------------- | ---------------------------------- |
| `GITHUB_CLIENT_ID`     | From step 1                        |
| `GITHUB_CLIENT_SECRET` | From step 1                        |
| `AUTH_SECRET`          | Random 32+ char string (see below) |

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

**D1 Database Bindings** — add:

- **Variable name:** `DB`
- **D1 database:** `mlp-characters`

> **Note:** For preview deploys, you may want a separate GitHub OAuth App with callback URL matching the preview domain.

### 5. Custom Domain

1. Ensure your domain's zone (e.g. `p97.dev`) is managed by Cloudflare (nameservers pointing to Cloudflare)
2. Go to your project → **Settings → Domains & Routes**
3. Add `mlp.p97.dev`
4. Cloudflare handles DNS and SSL automatically

### Manual Deploy

```bash
npm run build
npx wrangler deploy
```

## License

[UNLICENSE](LICENSE) (public domain)
