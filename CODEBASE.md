# MLP Character Sheet - Codebase Reference

## Overview

A digital character sheet for the **My Little Pony Roleplaying Game** (MLP Core Rulebook). It streamlines character generation for new players with a fully client-side, interactive web application. Currently level-1 only.

## Tech Stack

| Layer       | Technology      | Version      |
| ----------- | --------------- | ------------ |
| Framework   | Svelte 5        | 5.53.7       |
| Build Tool  | Vite            | 8.0.0        |
| Language    | TypeScript      | 5.9.3        |
| Module Type | ES Modules      | —            |
| Fonts       | Fredoka, Nunito | Google Fonts |

### Dev Dependencies

- `@sveltejs/vite-plugin-svelte` (7.0.0) - Vite/Svelte integration
- `@tsconfig/svelte` (5.0.8) - TS config preset for Svelte
- `@types/node` (24.12.0) - Node.js type definitions
- `svelte-check` (4.4.5) - Type checking for Svelte components

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

**Config files:** `vite.config.ts`, `svelte.config.js`, `tsconfig.json` (root), `tsconfig.app.json`, `tsconfig.node.json`

## Project Structure

```
src/
├── main.ts                    # Entry point, mounts App
├── App.svelte                 # Root component (two-page layout)
├── app.css                    # Global styles, CSS variables, responsive design
├── store.svelte.ts            # Global reactive state (CharacterStore class)
├── vite-env.d.ts              # Vite type declarations
├── components/
│   ├── BasicInfo.svelte       # Name, pronouns, level, origin/role selection
│   ├── CutieMarkSelector.svelte # Cutie mark image picker modal
│   ├── EssenceColumn.svelte   # Essence stat column (Str/Spd/Sma/Soc)
│   ├── EssenceCounter.svelte  # Floating essence point counter
│   ├── MagicAttack.svelte     # Unicorn spellcasting & magic rank
│   ├── OriginInfluence.svelte # Influences, bonds, hang-up
│   ├── OriginModal.svelte     # Origin selection modal (Earth/Pegasus/Unicorn)
│   ├── Perks.svelte           # All perk categories display
│   ├── RoleModal.svelte       # Spirit role selection modal
│   ├── SkillBox.svelte        # Individual skill with rank & specializations
│   ├── BackgroundTraits.svelte # Background bonds display
│   └── Tooltip.svelte         # Reusable tooltip (hover + click)
└── data/
    ├── rulebook.ts            # Influences (7 types), General Perks (5 types)
    └── roles.ts               # 6 Spirit Role definitions with lore

public/
├── logo.png                   # Main logo
├── favicon.svg                # Favicon
├── icons.svg                  # Icon sprite sheet
├── cutiemarks/                # 95+ cutie mark SVGs
└── origins/                   # 3 origin images (earth_pony, pegasus, unicorn)
```

## Architecture

### State Management

Single global `CharacterStore` class in `src/store.svelte.ts` using Svelte 5 runes:

- **`$state`** for reactive properties (name, origin, role, essence values, skills, etc.)
- **`$derived`** for computed values (total essence, available points, defenses)
- Exported as singleton: `export const character = new CharacterStore()`

**Key state groups:**

- **Basic info:** name, pronouns, description, origin, role, movement, languages
- **Essence system:** 4 base values (Str/Spd/Sma/Soc), diamond/gold essence bonuses, starting pool of 2 points
- **Skills:** `Record<string, number>` (skill name → rank 0-5), specializations (up to 3 per skill), 10 starting skill points
- **Character elements:** cutieMark, influences[], backgroundBonds[], perks[], hangup
- **Magic (Unicorn-only):** magicRank (0-8), masteredSpells (8 slots), attacks (3 slots)

### Component Architecture

```
App.svelte
├── EssenceCounter (floating, top-right)
├── Page 1:
│   ├── BasicInfo (with CutieMarkSelector, OriginModal, RoleModal modals)
│   ├── OriginInfluence
│   ├── Health/Wealth inputs
│   ├── Attack table
│   └── Stats Section (4 × EssenceColumn, each with 5-6 × SkillBox)
└── Page 2:
    ├── BackgroundTraits
    ├── Perks
    └── MagicAttack (Unicorn-only)
```

### Game Mechanics Implemented

- **Essence point allocation** with real-time validation and remaining counter
- **Skill rank progression**: D2 → D4 → D6 → D8 → D10 → D12 dice system
- **Origin-based bonuses**: Earth Pony (+1 Str), Pegasus (+1 Spd), Unicorn (+1 Sma)
- **Diamond Essence (+2) and Gold Essence (+1)** selection per origin
- **Derived defenses**: Toughness, Evasion, Willpower, Cleverness
- **Skill prerequisites** for general perks
- **Influence system** with automatic/random bond generation; mandatory hang-up for 2nd influence
- **Magic system** locked to Unicorn origin (spellcasting ranks, mastered spells with tier/circle)

### Styling

- CSS custom properties for theming (purple palette: `--primary-purple: #8B5A96`)
- Fixed-width container (1100px) with responsive breakpoint at 768px
- Two-page layout mimicking a physical character sheet
- Modal overlays for origin, role, and cutie mark selection

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

- No test framework configured yet

## Infrastructure

**No infrastructure definitions found:**

- No Docker configuration
- No CI/CD pipeline
- No deployment scripts
- No environment files
- Fully client-side application (no backend/API)
- No data persistence (in-memory only)

## Documentation

- `project_summary.md` - Feature list and layout rules
- `antigravity/PLAN.md` - Architecture and implementation plan
- `antigravity/SIMPLIFICATIONS.md` - Deviations from the MLP rulebook
- `README.md` - Generic Svelte+TS+Vite template readme

## License

UNLICENSE (public domain)
