# MLP Character Sheet - Simplifications & Omitted Features

This document outlines the simplifications and deviations from the full MLP Core Rulebook (Pages 17-146) to streamline our digital character sheet for new players.

## Character Generation Simplifications

1.  **Level:** Characters are hardcoded to Level 1.
2.  **Cutie Mark Perks:** We only allow selecting the aesthetic Cutie Mark. We do not automate Cutie Mark Perks. A note is added to the Perks section encouraging players to discuss their Cutie Mark Perk with their GM.
3.  **Origin Attribute Increases:** The Origin-based Essence score increase applies directly to the linked Essence pool. It never applies to the specific tied Influence Skill. If changing Origins makes the current skill distribution illegal, the UI will warn the user and automatically auto-correct the state by decreasing skills and dropping specializations.
4.  **Influences & Hang-ups:** Restricted to 1 or 2. 
    *   Influence 1 does NOT require a hang-up.
    *   Influence 2 MANDATES a hang-up. Players cannot choose not to use the hang-up.
    *   Influence 2 can be freely deleted/removed.
5.  **Background Bonds:** Tied per-influence. Users will receive up to 2 bonds (one per influence), initialized randomly from their associated influence list. Removing an influence removes its bond.
6.  **Specializations:** Instead of free-form, users choose from a dropdown of suggested specializations from the rulebook, plus an explicit option for "Unique Specialization - please discuss with GM."
7.  **Diamond/Gold essence only:** Only Diamond and Gold essence will be selected at this point. Silver and Bronze paths are omitted, as these come into play at level 3.
8.  **Spellcasting General Perk Restriction:** "Spellcasting" cannot be selected manually as a General Perk to prevent complex overlap.
9.  **General Perks:** 
    *   Origin-granted perks are added automatically, non-editable, and display a short summary of their rules text.
    *   We implement requirement checking for selectable base Perks (e.g., Earth Pony, Animal Pet). Selecting "Animal Pet" generates a warning to discuss the pet with the GM.
10. **Unicorn Magic Restriction:** The entire Magic section and spellcasting grids are only active and visible for the Unicorn origin.
11. **Spellcasting Specializations:** Omitted as a character generation step. Mastered spells are chosen directly.
12. **Weapons and Armor:** Omitted from Level 1 character generation. The Attack grid will only feature attacks granted inherently by acquired Magic Spells. Players start without external physical weapons or armor equipped.
13. **Calculated Defaults:** 
    *   Defenses (Toughness, Evasion, Willpower, Cleverness) are strictly derived from `10 + Essence Base`. 
    *   Health is derived strictly from Role defaults.
    *   Movement is derived strictly from Role defaults. However, if a Pegasus has the "Air Born" perk, they gain a dropdown to select from their 3 movement options.

## Advanced Rules
All supplemental or advanced variant rules present in the MLP Core Rulebook are strictly omitted.
