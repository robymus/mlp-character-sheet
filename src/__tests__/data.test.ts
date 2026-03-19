import { describe, it, expect } from 'vitest';
import { GENERAL_PERKS, GENERAL_PERK_NAMES } from '../lib/data/generalPerks';
import { INFLUENCES } from '../lib/data/influences';
import { SPELLS, TIER_MIN_RANK } from '../lib/data/spells';
import { ROLES } from '../lib/data/roles';
import { SKILL_SPECIALIZATIONS } from '../lib/data/specializations';
import { ESSENCE_SKILLS } from '../lib/store.svelte';
import type { EssenceType } from '../lib/store.svelte';

describe('General Perks data', () => {
    it('has perks defined', () => {
        expect(GENERAL_PERKS.length).toBeGreaterThan(0);
    });

    it('GENERAL_PERK_NAMES matches GENERAL_PERKS', () => {
        expect(GENERAL_PERK_NAMES).toEqual(GENERAL_PERKS.map((p) => p.name));
    });

    it('all perks have required fields', () => {
        for (const perk of GENERAL_PERKS) {
            expect(perk.name).toBeTruthy();
            expect(perk.shortDescription).toBeTruthy();
            expect(perk.fullDescription).toBeTruthy();
        }
    });

    it('no duplicate perk names', () => {
        const names = GENERAL_PERKS.map((p) => p.name);
        expect(new Set(names).size).toBe(names.length);
    });

    it('repeatable perks have value > 1', () => {
        for (const perk of GENERAL_PERKS) {
            if (perk.repeatable !== undefined) {
                expect(perk.repeatable).toBeGreaterThan(1);
            }
        }
    });

    it('perks with choices have at least 2 options', () => {
        for (const perk of GENERAL_PERKS) {
            if (perk.choices) {
                expect(perk.choices.length).toBeGreaterThanOrEqual(2);
            }
        }
    });

    it('prerequisite essences reference valid essence types', () => {
        const validTypes: EssenceType[] = ['strength', 'speed', 'smarts', 'social'];
        for (const perk of GENERAL_PERKS) {
            if (perk.prerequisite?.essence) {
                for (const key of Object.keys(perk.prerequisite.essence)) {
                    expect(validTypes).toContain(key);
                }
            }
        }
    });

    it('prerequisite skills reference valid skill names', () => {
        const allSkills = Object.values(ESSENCE_SKILLS).flat();
        for (const perk of GENERAL_PERKS) {
            if (perk.prerequisite?.skill) {
                for (const key of Object.keys(perk.prerequisite.skill)) {
                    expect(allSkills).toContain(key);
                }
            }
        }
    });
});

describe('Influences data', () => {
    it('has influences defined', () => {
        expect(INFLUENCES.length).toBeGreaterThan(0);
    });

    it('all influences have required fields', () => {
        for (const inf of INFLUENCES) {
            expect(inf.name).toBeTruthy();
            expect(inf.perkName).toBeTruthy();
            expect(inf.perkDescription).toBeTruthy();
            expect(inf.backgroundBonds).toBeDefined();
            expect(inf.backgroundBonds.length).toBeGreaterThan(0);
        }
    });

    it('no duplicate influence names', () => {
        const names = INFLUENCES.map((i) => i.name);
        expect(new Set(names).size).toBe(names.length);
    });
});

describe('Spells data', () => {
    it('has spells defined', () => {
        expect(SPELLS.length).toBeGreaterThan(0);
    });

    it('all spells have required fields', () => {
        for (const spell of SPELLS) {
            expect(spell.name).toBeTruthy();
            expect(spell.circle).toBeTruthy();
            expect(spell.tier).toBeTruthy();
            expect(spell.shortDescription).toBeTruthy();
            expect(spell.description).toBeTruthy();
        }
    });

    it('tier min ranks are ordered correctly', () => {
        expect(TIER_MIN_RANK.Elementary).toBeLessThan(TIER_MIN_RANK.Superior);
        expect(TIER_MIN_RANK.Superior).toBeLessThan(TIER_MIN_RANK.Virtuoso);
    });

    it('spell tiers are valid', () => {
        const validTiers = ['Elementary', 'Superior', 'Virtuoso'];
        for (const spell of SPELLS) {
            expect(validTiers).toContain(spell.tier);
        }
    });

    it('spell circles are valid', () => {
        const validCircles = ['Aid', 'Beam', 'Enchantment', 'Utility'];
        for (const spell of SPELLS) {
            expect(validCircles).toContain(spell.circle);
        }
    });

    it('no duplicate spell names', () => {
        const names = SPELLS.map((s) => s.name);
        expect(new Set(names).size).toBe(names.length);
    });

    it('spells with attackData have all required attack fields', () => {
        for (const spell of SPELLS) {
            if (spell.attackData) {
                expect(spell.attackData.range).toBeDefined();
                expect(spell.attackData.attack).toBeDefined();
                expect(spell.attackData.effects).toBeDefined();
                expect(spell.attackData.notes).toBeDefined();
            }
        }
    });
});

describe('Roles data', () => {
    it('has 6 roles', () => {
        expect(ROLES).toHaveLength(6);
    });

    it('all roles have name and icon', () => {
        for (const role of ROLES) {
            expect(role.name).toBeTruthy();
            expect(role.icon).toBeTruthy();
        }
    });
});

describe('Specializations data', () => {
    it('has specializations defined', () => {
        expect(Object.keys(SKILL_SPECIALIZATIONS).length).toBeGreaterThan(0);
    });

    it('all specialization keys are valid skill names', () => {
        const allSkills = Object.values(ESSENCE_SKILLS).flat();
        for (const key of Object.keys(SKILL_SPECIALIZATIONS)) {
            expect(allSkills).toContain(key);
        }
    });

    it('specialization entries are arrays', () => {
        for (const [, specs] of Object.entries(SKILL_SPECIALIZATIONS)) {
            expect(Array.isArray(specs)).toBe(true);
        }
    });
});
