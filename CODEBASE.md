# MLP Character Sheet - Codebase Reference

## Overview

A digital character sheet for the **My Little Pony Roleplaying Game** (MLP Core Rulebook). It streamlines character generation for new players with a fully client-side, interactive web application. Currently level-1 only.

## Tech Stack

| Layer       | Technology      | Version      |
| ----------- | --------------- | ------------ |
| Framework   | Svelte 5        | 5.53.7       |
| Build Tool  | Vite            | 8.0.0        |
| Language    | TypeScript      | 5.9.3        |
| Testing     | Vitest          | 4.1.0        |
| Module Type | ES Modules      | -            |
| Fonts       | Fredoka, Nunito | Google Fonts |

### Dev Dependencies

- `@sveltejs/vite-plugin-svelte` (7.0.0) - Vite/Svelte integration
- `@tsconfig/svelte` (5.0.8) - TS config preset for Svelte
- `@types/node` (24.12.0) - Node.js type definitions
- `svelte-check` (4.4.5) - Type checking for Svelte components
- `vitest` (4.1.0) - Unit testing framework
- `jsdom` - DOM environment for tests

## Build System

| Script         | Command                                                                    | Purpose                  |
| -------------- | -------------------------------------------------------------------------- | ------------------------ |
| `dev`          | `vite`                                                                     | Dev server with HMR      |
| `build`        | `vite build`                                                               | Production build         |
| `preview`      | `vite preview`                                                             | Preview production build |
| `check`        | `svelte-check --tsconfig ./tsconfig.app.json && tsc -p tsconfig.node.json` | Type checking            |
| `lint`         | `eslint .`                                                                 | Run ESLint               |
| `lint:fix`     | `eslint . --fix`                                                           | Auto-fix ESLint errors   |
| `format`       | `prettier --write .`                                                       | Format all files         |
| `format:check` | `prettier --check .`                                                       | Check formatting         |
| `test`         | `vitest run`                                                               | Run tests once           |
| `test:watch`   | `vitest`                                                                   | Run tests in watch mode  |

**Config files:** `vite.config.ts`, `svelte.config.js`, `tsconfig.json` (root), `tsconfig.app.json`, `tsconfig.node.json`

**Build notes:** `base: './'` in vite.config.ts produces relative asset paths for deployment under any subpath.

## Project Structure

```
src/
├── main.ts                    # Entry point, mounts App
├── App.svelte                 # Root component (two-page layout)
├── app.css                    # Global styles, CSS variables
├── store.svelte.ts            # Global reactive state (CharacterStore class)
├── __tests__/
│   ├── store.test.ts          # CharacterStore logic tests
│   ├── data.test.ts           # Game data integrity tests
│   └── build.test.ts          # Production build smoke tests
├── components/
│   ├── BasicInfo.svelte       # Name, pronouns, level, origin/role selection, complete stamp
│   ├── CutieMarkSelector.svelte # Cutie mark image picker modal
│   ├── EssenceColumn.svelte   # Essence stat column (Str/Spd/Sma/Soc)
│   ├── EssenceCounter.svelte  # Floating essence point counter
│   ├── GeneralPerkModal.svelte # General perk selection modal (Earth Pony)
│   ├── InfluenceModal.svelte  # Influence selection modal
│   ├── Magic.svelte           # Spellcasting & magic rank (Unicorn + Magical perk)
│   ├── OriginInfluence.svelte # Influences, bonds, hang-up
│   ├── OriginModal.svelte     # Origin selection modal (Earth/Pegasus/Unicorn)
│   ├── Perks.svelte           # All perk categories display
│   ├── BackgroundTraits.svelte # Background bonds with dice randomizer
│   ├── RoleModal.svelte       # Spirit role selection modal
│   ├── SkillBox.svelte        # Individual skill with rank & specializations
│   ├── SpellSelectorModal.svelte # Spell selection modal
│   └── Tooltip.svelte         # Reusable tooltip (hover + click)
└── data/
    ├── cutiemarks.ts          # Cutie mark filename list
    ├── generalPerks.ts        # 25 general perks with prerequisites
    ├── influences.ts          # 18 influences with bonds and perks
    ├── roles.ts               # 6 Spirit Role definitions
    ├── specializations.ts     # Skill specializations per skill
    └── spells.ts              # 20+ spells with tiers and circles

public/
├── logo.png                   # Main logo
├── favicon.svg                # Favicon
├── icons.svg                  # Icon sprite sheet
├── cutiemarks/                # 95+ cutie mark images
└── origins/                   # 3 origin images (earth_pony, pegasus, unicorn)
```

## Architecture

### State Management

Single global `CharacterStore` class in `src/store.svelte.ts` using Svelte 5 runes:

- **`$state`** for reactive properties (name, origin, role, essence values, skills, etc.)
- **`$derived`** for computed values (level)
- **Getters** for derived calculations (essence totals, skill points, health, completeness)
- Exported as singleton: `export const character = new CharacterStore()`

**Key state groups:**

- **Basic info:** name, pronouns, description, origin, role, movement, languages
- **Essence system:** 4 base values (Str/Spd/Sma/Soc, min 1), diamond/gold essence bonuses, 12 starting points
- **Skills:** `Record<string, number>` (skill name -> rank 0-6), specializations per skill
- **Perks:** generalPerks[], generalPerkChoices, origin perks (implicit), influence perks
- **Magic:** magicRank (0-6), masteredSpells (8 slots), isMagical (Unicorn or Magical perk)
- **Completeness:** `isComplete` getter checking name, origin, role, essences, skills, magic, perks, influences

### Component Architecture

```
App.svelte
├── EssenceCounter (floating, absolute positioned)
├── Page 1:
│   ├── BasicInfo (with CutieMarkSelector, OriginModal, RoleModal modals, complete stamp)
│   ├── OriginInfluence (with InfluenceModal)
│   ├── Health/Wealth inputs
│   ├── Attack table
│   └── Stats Section (4 x EssenceColumn, each with 5-6 x SkillBox)
└── Page 2:
    ├── BackgroundTraits (dice randomizer)
    ├── Perks (origin, influence, general with GeneralPerkModal, role)
    └── Magic (with SpellSelectorModal)
```

### Game Mechanics Implemented

- **Essence point allocation** with real-time validation and remaining counter (base min 1)
- **Skill rank progression**: D2 -> D4 -> D6 -> D8 -> D10 -> D12 dice system
- **Origin-based bonuses**: Earth Pony (+1 Str or Soc), Pegasus (+1 Spd), Unicorn (+1 Sma)
- **Diamond Essence (+2) and Gold Essence (+1)** selection per origin
- **Derived defenses**: Toughness, Evasion, Willpower, Cleverness
- **Health**: base from origin (Earth Pony 3, others 2) + conditioning skill
- **General perk system** with prerequisites (essence scores, skill ranks), choices, repeatability
- **Magical perk** unlocks spellcasting for non-Unicorn origins
- **Wealth status** derived from Wealth perk selection
- **Influence system** with automatic/random bond generation; mandatory hang-up for 2nd influence
- **Magic system** for Unicorn and Magical perk holders (spellcasting ranks, mastered spells with tier/circle)
- **Spell attacks** auto-generated from learned attack spells
- **Completeness tracking** with visual stamp when all required fields are filled

### Styling

- CSS custom properties for theming (purple palette: `--primary-purple: #8B5A96`)
- Fixed-width container (1100px), viewport set to 1200px for consistent desktop layout
- Two-page layout mimicking a physical character sheet
- Modal overlays for origin, role, influence, cutie mark, perk, and spell selection

## Linting & Formatting

- **ESLint 10** with flat config (`eslint.config.js`)
  - `@eslint/js` recommended rules
  - `typescript-eslint` recommended rules
  - `eslint-plugin-svelte` recommended rules
  - `eslint-config-prettier` to avoid conflicts
- **Prettier 3** with Svelte plugin (`.prettierrc`)
  - Tabs, single quotes, trailing commas, 100 char width
- **Scripts:** `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`
- **Type checking:** `svelte-check` and `tsc` via `npm run check`

## Testing

- **Vitest 4** with jsdom environment, configured in `vite.config.ts`
- **95 tests** across 3 test files:
  - `store.test.ts` - CharacterStore logic (essences, skills, health, magic, perks, completeness)
  - `data.test.ts` - Game data integrity (perks, influences, spells, roles, specializations)
  - `build.test.ts` - Production build smoke tests (output files, relative paths, JS parsing, markers)
- **Scripts:** `npm test` (single run), `npm run test:watch` (watch mode)

## Infrastructure

- Fully client-side application (no backend/API)
- No data persistence (in-memory only)
- No CI/CD pipeline
- No Docker configuration
- Deployable as static files under any subpath (relative asset paths)

## License

UNLICENSE (public domain)
