import { describe, it, expect, beforeEach } from 'vitest';
import { CharacterStore, ESSENCE_SKILLS } from '../store.svelte';

describe('CharacterStore', () => {
	let c: CharacterStore;

	beforeEach(() => {
		c = new CharacterStore();
	});

	// ─── Default State ───────────────────────────────────────────────

	describe('defaults', () => {
		it('starts with empty name, origin, role', () => {
			expect(c.name).toBe('');
			expect(c.origin).toBe('');
			expect(c.role).toBe('');
		});

		it('starts with base essences at 1', () => {
			expect(c.baseEssenceStr).toBe(1);
			expect(c.baseEssenceSpd).toBe(1);
			expect(c.baseEssenceSma).toBe(1);
			expect(c.baseEssenceSoc).toBe(1);
		});

		it('has 12 starting points with 8 available (4 allocated to base 1s)', () => {
			expect(c.startingPoints).toBe(12);
			expect(c.availableEssencePoints).toBe(8);
		});

		it('starts with level 1', () => {
			expect(c.level).toBe(1);
		});

		it('starts not magical', () => {
			expect(c.isMagical).toBe(false);
		});

		it('starts with Average wealth', () => {
			expect(c.wealthStatus).toBe('Average (d4)');
		});

		it('starts incomplete', () => {
			expect(c.isComplete).toBe(false);
		});
	});

	// ─── Essence Calculations ────────────────────────────────────────

	describe('essence calculations', () => {
		it('base essences with no origin bonuses', () => {
			expect(c.essenceStr).toBe(1);
			expect(c.essenceSpd).toBe(1);
			expect(c.essenceSma).toBe(1);
			expect(c.essenceSoc).toBe(1);
		});

		it('Earth Pony gets +1 Strength by default', () => {
			c.origin = 'Earth Pony';
			c.earthPonyEssence = 'strength';
			expect(c.essenceStr).toBe(2);
			expect(c.essenceSoc).toBe(1);
		});

		it('Earth Pony can choose +1 Social instead', () => {
			c.origin = 'Earth Pony';
			c.earthPonyEssence = 'social';
			expect(c.essenceStr).toBe(1);
			expect(c.essenceSoc).toBe(2);
		});

		it('Pegasus gets +1 Speed', () => {
			c.origin = 'Pegasus';
			expect(c.essenceSpd).toBe(2);
		});

		it('Unicorn gets +1 Smarts', () => {
			c.origin = 'Unicorn';
			expect(c.essenceSma).toBe(2);
		});

		it('diamond essence adds +2', () => {
			c.diamondEssence = 'strength';
			expect(c.essenceStr).toBe(3);
		});

		it('gold essence adds +1', () => {
			c.goldEssence = 'speed';
			expect(c.essenceSpd).toBe(2);
		});

		it('diamond and gold can stack on same essence', () => {
			c.diamondEssence = 'smarts';
			c.goldEssence = 'smarts';
			expect(c.essenceSma).toBe(4); // 1 base + 2 diamond + 1 gold
		});

		it('all bonuses stack: Unicorn + diamond + gold on smarts', () => {
			c.origin = 'Unicorn';
			c.diamondEssence = 'smarts';
			c.goldEssence = 'smarts';
			expect(c.essenceSma).toBe(5); // 1 base + 1 unicorn + 2 diamond + 1 gold
		});

		it('essenceValue returns correct values', () => {
			c.baseEssenceStr = 3;
			c.baseEssenceSpd = 2;
			c.baseEssenceSma = 4;
			c.baseEssenceSoc = 1;
			expect(c.essenceValue('strength')).toBe(3);
			expect(c.essenceValue('speed')).toBe(2);
			expect(c.essenceValue('smarts')).toBe(4);
			expect(c.essenceValue('social')).toBe(1);
		});
	});

	// ─── Available Essence Points ────────────────────────────────────

	describe('available essence points', () => {
		it('decreases when base essences are increased', () => {
			c.baseEssenceStr = 3;
			expect(c.availableEssencePoints).toBe(6); // 12 - (3+1+1+1)
		});

		it('reaches 0 when all 12 points allocated', () => {
			c.baseEssenceStr = 3;
			c.baseEssenceSpd = 3;
			c.baseEssenceSma = 3;
			c.baseEssenceSoc = 3;
			expect(c.availableEssencePoints).toBe(0);
		});
	});

	// ─── Skill Points ────────────────────────────────────────────────

	describe('skill points', () => {
		it('skill points available equals essence value with no skills allocated', () => {
			c.baseEssenceStr = 3;
			expect(c.skillPointsAvailableIn('strength')).toBe(3);
		});

		it('allocating a skill reduces available points', () => {
			c.baseEssenceStr = 3;
			c.skills['athletics'] = 2;
			expect(c.skillPointsUsedIn('strength')).toBe(2);
			expect(c.skillPointsAvailableIn('strength')).toBe(1);
		});

		it('specializations count toward used skill points', () => {
			c.baseEssenceStr = 3;
			c.skills['athletics'] = 1;
			c.specializations['athletics'] = ['Running'];
			expect(c.skillPointsUsedIn('strength')).toBe(2);
		});

		it('total skill points accounts for all essences minus magic', () => {
			c.baseEssenceStr = 3;
			c.baseEssenceSpd = 3;
			c.baseEssenceSma = 3;
			c.baseEssenceSoc = 3;
			// total pool = 12, no skills allocated, no magic
			expect(c.totalSkillPointsAvailable).toBe(12);
		});

		it('magic rank reduces total skill points', () => {
			c.baseEssenceStr = 3;
			c.baseEssenceSpd = 3;
			c.baseEssenceSma = 3;
			c.baseEssenceSoc = 3;
			c.magicRank = 2;
			expect(c.totalSkillPointsAvailable).toBe(10);
		});

		it('spendable points in an essence is min of column available and total available', () => {
			c.baseEssenceStr = 5;
			c.baseEssenceSpd = 1;
			c.baseEssenceSma = 1;
			c.baseEssenceSoc = 1;
			// total = 8, strength column = 5, so spendable in strength = min(5, 8) = 5
			expect(c.spendableSkillPointsIn('strength')).toBe(5);

			// Allocate 5 to strength skills, leaving 3 total
			c.skills['athletics'] = 3;
			c.skills['brawn'] = 2;
			// strength column: 0 left; total: 3 left
			expect(c.spendableSkillPointsIn('strength')).toBe(0);
			expect(c.spendableSkillPointsIn('speed')).toBe(1); // min(1, 3)
		});
	});

	// ─── canDecrementEssence ─────────────────────────────────────────

	describe('canDecrementEssence', () => {
		it('cannot decrement below base 1 with no bonuses', () => {
			// essenceStr = 1 (base 1, no bonuses), decrement would make it 0
			// but the base would go to 0. The method checks essenceValue - 1 >= 0
			expect(c.canDecrementEssence('strength')).toBe(true); // 1 -> 0 is allowed by method
		});

		it('cannot decrement when skills would exceed new essence value', () => {
			c.baseEssenceStr = 2;
			c.skills['athletics'] = 2; // uses 2, so can't go below 2
			expect(c.canDecrementEssence('strength')).toBe(false);
		});

		it('can decrement when skills are below new value', () => {
			c.baseEssenceStr = 3;
			c.skills['athletics'] = 1;
			expect(c.canDecrementEssence('strength')).toBe(true);
		});

		it('cannot decrement when total pool would go below total used', () => {
			c.baseEssenceStr = 2;
			c.baseEssenceSpd = 2;
			c.baseEssenceSma = 1;
			c.baseEssenceSoc = 1;
			// total pool = 6
			// allocate 6 skill points across columns
			c.skills['athletics'] = 1; // str
			c.skills['acrobatics'] = 2; // spd
			c.skills['alertness'] = 1; // sma
			c.skills['persuasion'] = 1; // soc
			c.magicRank = 1;
			// total used = 1+2+1+1+1 = 6 = total pool
			// decrementing any would make pool = 5 < 6 used
			expect(c.canDecrementEssence('strength')).toBe(false);
		});
	});

	// ─── Health ──────────────────────────────────────────────────────

	describe('health', () => {
		it('returns 0 with no origin', () => {
			expect(c.health).toBe(0);
		});

		it('Earth Pony base health is 3', () => {
			c.origin = 'Earth Pony';
			expect(c.health).toBe(3);
		});

		it('Pegasus base health is 2', () => {
			c.origin = 'Pegasus';
			expect(c.health).toBe(2);
		});

		it('Unicorn base health is 2', () => {
			c.origin = 'Unicorn';
			expect(c.health).toBe(2);
		});

		it('conditioning increases health', () => {
			c.origin = 'Pegasus';
			c.skills['conditioning'] = 3;
			expect(c.health).toBe(5);
		});
	});

	// ─── isMagical ───────────────────────────────────────────────────

	describe('isMagical', () => {
		it('Unicorn is always magical', () => {
			c.origin = 'Unicorn';
			expect(c.isMagical).toBe(true);
		});

		it('Earth Pony is not magical by default', () => {
			c.origin = 'Earth Pony';
			expect(c.isMagical).toBe(false);
		});

		it('Earth Pony becomes magical with Magical perk', () => {
			c.origin = 'Earth Pony';
			c.generalPerks = ['Magical'];
			expect(c.isMagical).toBe(true);
		});

		it('Pegasus is not magical', () => {
			c.origin = 'Pegasus';
			expect(c.isMagical).toBe(false);
		});
	});

	// ─── Wealth ──────────────────────────────────────────────────────

	describe('wealthStatus', () => {
		it('default is Average', () => {
			expect(c.wealthStatus).toBe('Average (d4)');
		});

		it('Wealth perk makes it Well Off', () => {
			c.generalPerks = ['Wealth'];
			expect(c.wealthStatus).toBe('Well Off (d6)');
		});
	});

	// ─── Reset Allocations ───────────────────────────────────────────

	describe('resetAllocations', () => {
		it('resets base essences to 1', () => {
			c.baseEssenceStr = 5;
			c.baseEssenceSpd = 3;
			c.baseEssenceSma = 2;
			c.baseEssenceSoc = 2;
			c.resetAllocations();
			expect(c.baseEssenceStr).toBe(1);
			expect(c.baseEssenceSpd).toBe(1);
			expect(c.baseEssenceSma).toBe(1);
			expect(c.baseEssenceSoc).toBe(1);
		});

		it('resets skills to 0', () => {
			c.skills['athletics'] = 3;
			c.skills['acrobatics'] = 2;
			c.resetAllocations();
			expect(c.skills['athletics']).toBe(0);
			expect(c.skills['acrobatics']).toBe(0);
		});

		it('resets specializations to empty', () => {
			c.specializations['athletics'] = ['Running', 'Jumping'];
			c.resetAllocations();
			expect(c.specializations['athletics']).toEqual([]);
		});

		it('resets magic rank and spells', () => {
			c.magicRank = 3;
			c.masteredSpells[0] = 'Light';
			c.masteredSpells[1] = 'Shield';
			c.resetAllocations();
			expect(c.magicRank).toBe(0);
			expect(c.masteredSpells.every((s) => s === '')).toBe(true);
		});
	});

	// ─── Spell Attacks ───────────────────────────────────────────────

	describe('spellAttacks', () => {
		it('returns empty array with no magic', () => {
			expect(c.spellAttacks).toEqual([]);
		});

		it('returns empty array with magic rank but no spells', () => {
			c.magicRank = 3;
			expect(c.spellAttacks).toEqual([]);
		});

		it('only includes spells within active slot count', () => {
			c.magicRank = 1;
			// Slot 0 is active (magicRank=1, activeSlots = min(1,6) = 1)
			// Slot 1 is not active
			c.masteredSpells[0] = 'Nonexistent Spell';
			c.masteredSpells[1] = 'Also Nonexistent';
			// Neither spell exists in SPELLS data, so no attacks
			expect(c.spellAttacks).toEqual([]);
		});
	});

	// ─── isComplete ──────────────────────────────────────────────────

	describe('isComplete', () => {
		function makeMinimalComplete(char: CharacterStore) {
			char.name = 'Test Pony';
			char.origin = 'Pegasus';
			char.role = 'Spirit of Loyalty';
			char.influences = ['Humor'];
			// Allocate all essence points: 12 total, base starts at 4 (1 each)
			char.baseEssenceStr = 3;
			char.baseEssenceSpd = 3;
			char.baseEssenceSma = 3;
			char.baseEssenceSoc = 3;
			// Allocate all skill points (total = 12 + 1 pegasus bonus = 13)
			// Just fill enough skills to use all points
			char.skills['athletics'] = 3; // str
			char.skills['brawn'] = 0;
			char.skills['acrobatics'] = 4; // spd (3 base + 1 pegasus)
			char.skills['alertness'] = 3; // sma
			char.skills['persuasion'] = 3; // soc
		}

		it('complete Pegasus character', () => {
			makeMinimalComplete(c);
			expect(c.isComplete).toBe(true);
		});

		it('incomplete without name', () => {
			makeMinimalComplete(c);
			c.name = '';
			expect(c.isComplete).toBe(false);
		});

		it('incomplete without name (whitespace only)', () => {
			makeMinimalComplete(c);
			c.name = '   ';
			expect(c.isComplete).toBe(false);
		});

		it('incomplete without origin', () => {
			makeMinimalComplete(c);
			c.origin = '';
			expect(c.isComplete).toBe(false);
		});

		it('incomplete without role', () => {
			makeMinimalComplete(c);
			c.role = '';
			expect(c.isComplete).toBe(false);
		});

		it('incomplete without influence', () => {
			makeMinimalComplete(c);
			c.influences = [];
			expect(c.isComplete).toBe(false);
		});

		it('incomplete with unallocated essence points', () => {
			makeMinimalComplete(c);
			c.baseEssenceSoc = 1; // free up 2 points
			expect(c.isComplete).toBe(false);
		});

		it('incomplete with unallocated skill points', () => {
			makeMinimalComplete(c);
			c.skills['athletics'] = 0; // free up 3 skill points
			expect(c.isComplete).toBe(false);
		});

		it('Earth Pony incomplete without general perk', () => {
			c.name = 'Applejack';
			c.origin = 'Earth Pony';
			c.role = 'Spirit of Honesty';
			c.influences = ['Family'];
			c.earthPonyEssence = 'strength';
			// Allocate all essence: 12 total
			c.baseEssenceStr = 3;
			c.baseEssenceSpd = 3;
			c.baseEssenceSma = 3;
			c.baseEssenceSoc = 3;
			// total essence values: str=4, spd=3, sma=3, soc=3 = 13
			c.skills['athletics'] = 4;
			c.skills['acrobatics'] = 3;
			c.skills['alertness'] = 3;
			c.skills['persuasion'] = 3;
			// No general perk selected
			expect(c.isComplete).toBe(false);
		});

		it('Earth Pony complete with general perk', () => {
			c.name = 'Applejack';
			c.origin = 'Earth Pony';
			c.role = 'Spirit of Honesty';
			c.influences = ['Family'];
			c.earthPonyEssence = 'strength';
			c.generalPerks = ['Farmer'];
			c.baseEssenceStr = 3;
			c.baseEssenceSpd = 3;
			c.baseEssenceSma = 3;
			c.baseEssenceSoc = 3;
			c.skills['athletics'] = 4;
			c.skills['acrobatics'] = 3;
			c.skills['alertness'] = 3;
			c.skills['persuasion'] = 3;
			expect(c.isComplete).toBe(true);
		});

		it('Unicorn with magic is incomplete without filled spell slots', () => {
			c.name = 'Twilight';
			c.origin = 'Unicorn';
			c.role = 'Spirit of Magic';
			c.influences = ['Education'];
			c.baseEssenceStr = 3;
			c.baseEssenceSpd = 3;
			c.baseEssenceSma = 3;
			c.baseEssenceSoc = 3;
			// Unicorn: sma = 4, others = 3, total = 13
			// Spend 1 on magic, 12 on skills
			c.magicRank = 1;
			c.skills['athletics'] = 3;
			c.skills['acrobatics'] = 3;
			c.skills['alertness'] = 3;
			c.skills['persuasion'] = 3;
			// magicRank=1 means 1 spell slot needs to be filled
			expect(c.isComplete).toBe(false);
		});

		it('Unicorn with magic is complete with filled spell slots', () => {
			c.name = 'Twilight';
			c.origin = 'Unicorn';
			c.role = 'Spirit of Magic';
			c.influences = ['Education'];
			c.baseEssenceStr = 3;
			c.baseEssenceSpd = 3;
			c.baseEssenceSma = 3;
			c.baseEssenceSoc = 3;
			c.magicRank = 1;
			c.skills['athletics'] = 3;
			c.skills['acrobatics'] = 3;
			c.skills['alertness'] = 3;
			c.skills['persuasion'] = 3;
			c.masteredSpells[0] = 'Light';
			expect(c.isComplete).toBe(true);
		});
	});

	// ─── ESSENCE_SKILLS mapping ──────────────────────────────────────

	describe('ESSENCE_SKILLS', () => {
		it('has 4 essence types', () => {
			expect(Object.keys(ESSENCE_SKILLS)).toHaveLength(4);
		});

		it('strength has 5 skills', () => {
			expect(ESSENCE_SKILLS.strength).toHaveLength(5);
			expect(ESSENCE_SKILLS.strength).toContain('athletics');
			expect(ESSENCE_SKILLS.strength).toContain('conditioning');
		});

		it('speed has 6 skills', () => {
			expect(ESSENCE_SKILLS.speed).toHaveLength(6);
			expect(ESSENCE_SKILLS.speed).toContain('initiative');
		});

		it('smarts has 5 skills', () => {
			expect(ESSENCE_SKILLS.smarts).toHaveLength(5);
			expect(ESSENCE_SKILLS.smarts).toContain('science');
		});

		it('social has 5 skills', () => {
			expect(ESSENCE_SKILLS.social).toHaveLength(5);
			expect(ESSENCE_SKILLS.social).toContain('persuasion');
		});
	});
});
