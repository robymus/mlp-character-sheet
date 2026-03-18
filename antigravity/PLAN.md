# Goal Description

Revamp the MLP Character Sheet using Svelte 5 (a lightweight, highly readable frontend framework) to support interactive character generation logic based on the MLP Core Rulebook, applying specific simplifications to make it accessible to new players.

## User Review Required

Please review the framework choice (Svelte 5 + Vite) and the documented simplifications located in `/home/robymus/projects/mlp-character-sheet/antigravity/SIMPLIFICATIONS.md`.
Are you happy with Svelte as the framework, and do the simplifications accurately reflect your design goals?

## Proposed Changes

### Core Architecture

- Scaffold a new Vite + Svelte project within the existing directory structure (overwriting the vanilla setup but porting over the CSS tokens and cutie mark assets).
- **State Management**: Create a central Svelte state store (`src/store.ts`) to hold:
  - Editable fields (Name, Origin, Influences, etc.)
  - Essence distribution points (Pool of available points, current allocations)
  - Derived calculations (Health, Movement, Defenses)
- As a general guideline, try to disable elements that are not usable now (for example if I have only 2 points left, only the next 2 ranks should be available in each skill in a column), so we can't create an inconsistent state. For the disabled elements, when clicked, show a tooltip explaining how to enable it (eg. to increase this, you have to increase your Strength first). This applies to the whole sheet. Similarly, if decreasing a skill is not possible, as too many skills are already allocated, tell in the tooltip this, to decrease, remove some skills. Note: when magic is active, this validation has to take the points allocated to spellcasting as well, for each column.
- This will most likely be used from a tablet, and hover is not available, so besides hover, use click event as well to display the tooltips on disabled elements. When a tooltip is display on the click event, it should go away when another click happens (anywhere). Create a smart component for tooltips for reusability.

### Component Breakdown

#### `src/App.svelte`

- Main orchestrator handling the pages layout.
- Holds the floating "Essence Points Available" bubble outside the white container sheet.

#### `src/components/BasicInfo.svelte`

- Inputs for Name, Pronouns, Description, Languages.
- Cutie Mark selector modal.
- Level (Hardcoded to 1 display).
- Movement: Displays static derived speed, EXCEPT for Pegasus with Air Born perk, which renders a 3-option dropdown.

#### `src/components/OriginInfluence.svelte`

- Dropdowns for Origin. Automatically applies the Origin-based Essence bonus. Includes logic to warn and automatically downgrade illegal skill distributions if changing the origin breaks the essence math.
- Selectors for Influence 1 (No hang-up) and optional Influence 2 (Mandatory hang-up + delete capability).

#### `src/components/BackgroundTraits.svelte`

- Background Bonds section.
- Renders 1 or 2 bond dropdowns depending on the number of selected influences. Updates dynamically if an influence is removed.

#### `src/components/EssenceColumn.svelte` (Reusable)

- Props: `essenceName` (e.g., Strength), `themeColor`.
- Contains the Essence Rank with `+` and `-` buttons. Checks the global pool before allowing increments.
- Calculates and displays corresponding Defense (`10 + Essence Base`).
- Iterates over child skills using `SkillBox.svelte`.

#### `src/components/SkillBox.svelte` (Reusable)

- Handles Specialization dropdowns (rulebook defaults + "Unique Specialization").
- Validates point increments against the specific Essence limits, throwing a warning if insufficient points exist.

#### `src/components/Perks.svelte`

- General Perk selector + Cutie Mark perk note ("Please discuss your cutie mark perk with your GM").
- Origin Perks list: Automatically populated, read-only, accompanied by rule summaries.
- Checks and enforces General Perk prerequisites (Warning if user doesn't meet minimum requirements). Spellcasting is explicitly blocked from this dropdown.
- "Animal Pet" adds the GM discussion note.

#### `src/components/MagicAttack.svelte`

- Conditional render: Only active if Origin == Unicorn.
- **Essence Pool Logic:** Uses a master counter for Magic which is the sum of ALL leftover distributed essence points (since points spent on skills elsewhere reduce the available pool for magic, the global tally ensures total magic + skill points <= total essence points).
- **Spellcasting Rank:** Updates the base die in the table securely.
- **Mastered Spells:**
  - Each rank unlocks 1 slot.
  - Slot 1/2: Elementary spells only.
  - Slot 3/4: Elementary + Superior.
  - Slot 5/6: Elementary + Superior + Virtuoso.
  - Implemented as a tabbed interface starting on the highest available power tier. Mastered spells are chosen directly without specializations.
- Attack grid constrained to Magic-granted items only.

## Verification Plan

### Automated Build Verification

- Execute `npm install` and `npm run build` to ensure the Svelte setup compiles properly without any Vite build errors.

### Manual Verification

1. **Scaffold check:** Run `npm run dev` and open the page in browser tools.
2. **Logic verification:**
   - Select "Earth Pony" and verify the Essence bonus applies correctly.
   - Select two Influences and verify the "Hang-up required" prompt appears.
   - Try spending Essence points via the +/- buttons and verify the floating point counter decreases out of the main container boundaries.
   - Attempt to exceed the available Essence points and verify the system blocks it with a warning.
   - Select "Animal Pet" perk and verify the GM note appears.
3. **Responsive Verification:** Re-verify that the mobile layout remains un-collapsed using the Chrome DevTools mobile view.
