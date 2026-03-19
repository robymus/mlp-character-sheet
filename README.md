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

The build output uses relative asset paths (`base: './'`), so it can be deployed under any URL path:

```bash
npm run build
# Deploy the dist/ folder
```

## License

[UNLICENSE](LICENSE) (public domain)
