# MLP Character Sheet Project Overview

This file serves as a persistent memory/summary of features, styling rules, and layout structures for the My Little Pony Roleplaying Game character sheet.

## 1. Top Header
- **Logo Area**: Contains the custom `public/logo.png`
- **Cutie Mark Selection**: 
  - Located securely inside the `.logo-area` container to the left of the logo.
  - On page load, `main.js` selects a random image from `src/assets/cutiemarks/` utilizing the `src/cutiemarks.js` array.
  - Clicking the cutie mark opens a hidden modal (`#cutie-mark-modal`).
  - The modal grid includes a custom SVG (`src/assets/cutiemarks/random_choice.svg`) which functions as a randomizer button, and all 95 downloaded Fandom wiki cutie marks.

## 2. Stat Blocks & Grid Layout
- **Middle Grid**: Operates on a specific `grid-template-columns: 2.5fr 1fr 4fr;` layout linking "Traits", "Points", and "Attack Table".
  - The "Wealth Status" & "Health" headers live in the center and are formatted identically to the Influences/Hang-ups modules.
- **Attributes Structure**: Divided into columns (Strength, Speed, Smarts, Social).
  - Attribute "bubbles" sit at exactly `top: 0; left: 50%; transform: translate(-50%, -50%)`, cutting the top border perfectly down the middle. No input overlap.
  - Derived Stats (Toughness, Evasion, Willpower, Cleverness) have `35px` square `number` inputs that line up with the `10 + Essence + Perks + Armor` formula boxes.

## 3. Skills & Specializations
- "SPECIALIZATION" label is vertically rotated (`writing-mode: vertical-rl; rotate(180deg)`) and housed *inside* a custom flex border (`.skill-specialization`) alongside 3 rows of checkbox/text inputs.
- "Conditioning" and "Initiative" skills correctly skip the specialization render via JavaScript logic.

## 4. Magic Section
- **Mastered Spells List**: Enforced to 8 total input rows. The checkboxes, Tier, and Circle fields are explicitly styled without margins to lock them to an exact identical baseline (`25px` height).
- The "MAGIC" attribute bubble is widened slightly and perfectly styled to mimic the standard 4 physical Attributes above.
