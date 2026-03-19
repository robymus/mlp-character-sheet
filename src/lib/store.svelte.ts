import { SPELLS } from './data/spells';

// Basic Types
export type Origin = 'Earth Pony' | 'Pegasus' | 'Unicorn' | '';
export type Role =
    | 'Spirit of Generosity'
    | 'Spirit of Honesty'
    | 'Spirit of Kindness'
    | 'Spirit of Laughter'
    | 'Spirit of Loyalty'
    | 'Spirit of Magic'
    | '';

export type EssenceType = 'strength' | 'speed' | 'smarts' | 'social';

// Which skills belong to which essence
export const ESSENCE_SKILLS: Record<EssenceType, string[]> = {
    strength: ['athletics', 'brawn', 'conditioning', 'intimidation', 'might'],
    speed: ['acrobatics', 'driving', 'finesse', 'infiltration', 'initiative', 'targeting'],
    smarts: ['alertness', 'culture', 'science', 'survival', 'technology'],
    social: ['animal_handling', 'deception', 'performance', 'persuasion', 'streetwise'],
};

// Core state class using Svelte 5 runes
export class CharacterStore {
    name = $state('');
    pronouns = $state('');
    level = $derived(1); // Hardcoded
    description = $state('');
    origin = $state<Origin>('');
    diamondEssence = $state<EssenceType | ''>('');
    goldEssence = $state<EssenceType | ''>('');
    movement = $state('');
    role = $state<Role>('');
    languages = $state('Pony');
    cutieMark = $state('cutiemarks/random_choice.svg');
    earthPonyEssence = $state<'strength' | 'social'>('strength');
    adaptableEssence = $state<EssenceType>('strength');
    honestyEssence = $state<'strength' | 'speed' | 'smarts'>('strength');
    kindnessSkill = $state<'alertness' | 'animal_handling' | 'persuasion'>('alertness');
    influences = $state<string[]>([]);
    hangup = $state<string>(''); // For 2nd influence
    backgroundBonds = $state<string[]>([]);

    // Essences — 12 freely distributable points
    startingPoints = $state(12);

    baseEssenceStr = $state(1);
    baseEssenceSpd = $state(1);
    baseEssenceSma = $state(1);
    baseEssenceSoc = $state(1);

    get essenceStr() {
        return (
            this.baseEssenceStr +
            (this.origin === 'Earth Pony' && this.earthPonyEssence === 'strength' ? 1 : 0) +
            (this.diamondEssence === 'strength' ? 2 : 0) +
            (this.goldEssence === 'strength' ? 1 : 0)
        );
    }
    get essenceSpd() {
        return (
            this.baseEssenceSpd +
            (this.origin === 'Pegasus' ? 1 : 0) +
            (this.diamondEssence === 'speed' ? 2 : 0) +
            (this.goldEssence === 'speed' ? 1 : 0)
        );
    }
    get essenceSma() {
        return (
            this.baseEssenceSma +
            (this.origin === 'Unicorn' ? 1 : 0) +
            (this.diamondEssence === 'smarts' ? 2 : 0) +
            (this.goldEssence === 'smarts' ? 1 : 0)
        );
    }
    get essenceSoc() {
        return (
            this.baseEssenceSoc +
            (this.origin === 'Earth Pony' && this.earthPonyEssence === 'social' ? 1 : 0) +
            (this.diamondEssence === 'social' ? 2 : 0) +
            (this.goldEssence === 'social' ? 1 : 0)
        );
    }

    essenceValue(type: EssenceType): number {
        switch (type) {
            case 'strength':
                return this.essenceStr;
            case 'speed':
                return this.essenceSpd;
            case 'smarts':
                return this.essenceSma;
            case 'social':
                return this.essenceSoc;
        }
    }

    get availableEssencePoints() {
        const allocated =
            this.baseEssenceStr + this.baseEssenceSpd + this.baseEssenceSma + this.baseEssenceSoc;
        return this.startingPoints - allocated;
    }

    // Skills — per-essence pools
    skills = $state<Record<string, number>>({});
    /** skillName -> array of active specialization names */
    specializations = $state<Record<string, string[]>>({});

    /** Count of active specializations for a skill */
    specCountFor(skillName: string): number {
        return (this.specializations[skillName] || []).length;
    }

    /** How many skill points are used by skills + specializations in this essence */
    skillPointsUsedIn(type: EssenceType): number {
        const skills = ESSENCE_SKILLS[type];
        return skills.reduce(
            (sum, skill) => sum + (this.skills[skill] || 0) + this.specCountFor(skill),
            0,
        );
    }

    /** Column capacity remaining (essence value minus skills allocated in that column) */
    skillPointsAvailableIn(type: EssenceType): number {
        return this.essenceValue(type) - this.skillPointsUsedIn(type);
    }

    /** Total skill points remaining across all essences (minus magic) */
    get totalSkillPointsAvailable(): number {
        return (
            this.skillPointsAvailableIn('strength') +
            this.skillPointsAvailableIn('speed') +
            this.skillPointsAvailableIn('smarts') +
            this.skillPointsAvailableIn('social') -
            this.magicRank
        );
    }

    /** Actual spendable skill points in a specific essence (accounts for magic borrowing) */
    spendableSkillPointsIn(type: EssenceType): number {
        return Math.min(this.skillPointsAvailableIn(type), this.totalSkillPointsAvailable);
    }

    /** Available points for magic (sum of all remaining essence pools minus magic already spent) */
    get availableMagicPoints(): number {
        return this.totalSkillPointsAvailable;
    }

    /** Check if an essence can be decremented without invalidating skill allocations */
    canDecrementEssence(type: EssenceType): boolean {
        const newEssenceValue = this.essenceValue(type) - 1;
        if (newEssenceValue < 0) return false;

        // Can't go below what's already allocated to skills in this column
        const usedInEssence = this.skillPointsUsedIn(type);
        if (newEssenceValue < usedInEssence) return false;

        // Check that individual skill ranks don't exceed new essence value
        const skills = ESSENCE_SKILLS[type];
        for (const skill of skills) {
            if ((this.skills[skill] || 0) > newEssenceValue) return false;
        }

        // Check total pool doesn't go below total used (skills + specs + magic)
        const totalSpecCount = Object.values(this.specializations).reduce(
            (sum, specs) => sum + specs.length,
            0,
        );
        const totalUsed =
            Object.values(this.skills).reduce((sum, rank) => sum + rank, 0) +
            totalSpecCount +
            this.magicRank;
        const newTotalPool =
            this.essenceStr + this.essenceSpd + this.essenceSma + this.essenceSoc - 1;
        if (newTotalPool < totalUsed) return false;

        return true;
    }

    // Health: base from origin + conditioning
    get health(): number {
        if (!this.origin) return 0;
        const base = this.origin === 'Earth Pony' ? 3 : 2;
        return base + (this.skills['conditioning'] || 0);
    }

    /** Reset essences, skills, and magic when origin/diamond/gold changes */
    resetAllocations() {
        this.baseEssenceStr = 1;
        this.baseEssenceSpd = 1;
        this.baseEssenceSma = 1;
        this.baseEssenceSoc = 1;
        for (const key of Object.keys(this.skills)) {
            this.skills[key] = 0;
        }
        for (const key of Object.keys(this.specializations)) {
            this.specializations[key] = [];
        }
        this.magicRank = 0;
        this.masteredSpells = Array(8).fill('');
    }

    perks = $state<string[]>([]);
    /** General perk selections: each entry is a perk name */
    generalPerks = $state<string[]>([]);
    /** Choice made for each general perk (e.g. Acute Sense -> "Sight") */
    generalPerkChoices = $state<Record<string, string>>({});

    /** Whether the character has the Magical perk (Unicorn auto, or selected as general perk) */
    get isMagical(): boolean {
        return this.origin === 'Unicorn' || this.generalPerks.includes('Magical');
    }

    /** Wealth status based on Wealth perk */
    get wealthStatus(): string {
        const wealthCount = this.generalPerks.filter((p) => p === 'Wealth').length;
        if (wealthCount >= 1) return 'Well Off (d6)';
        return 'Average (d4)';
    }

    // Magic
    magicRank = $state<number>(0);
    /** Each slot holds a spell name or '' for empty. Index 0..7 (up to 8 slots). */
    masteredSpells = $state<string[]>(Array(8).fill(''));
    attacks = $state<
        { name: string; range: string; attack: string; effects: string; notes: string }[]
    >(
        Array(3)
            .fill(null)
            .map(() => ({ name: '', range: '', attack: '', effects: '', notes: '' })),
    );

    /** Attack rows auto-generated from learned spells that have attackData */
    get spellAttacks(): {
        name: string;
        range: string;
        attack: string;
        effects: string;
        notes: string;
    }[] {
        const result: {
            name: string;
            range: string;
            attack: string;
            effects: string;
            notes: string;
        }[] = [];
        const activeSlotCount = Math.min(this.magicRank, 6);
        for (let i = 0; i < activeSlotCount; i++) {
            const spellName = this.masteredSpells[i];
            if (!spellName) continue;
            const spell = SPELLS.find((s) => s.name === spellName);
            if (!spell?.attackData) continue;
            result.push({
                name: spell.name,
                range: spell.attackData.range,
                attack: spell.attackData.attack,
                effects: spell.attackData.effects,
                notes: spell.attackData.notes,
            });
        }
        return result;
    }

    /** Whether the character sheet is fully complete */
    get isComplete(): boolean {
        // Name must be filled
        if (!this.name.trim()) return false;

        // Origin and role must be selected
        if (!this.origin) return false;
        if (!this.role) return false;

        // All essence points allocated
        if (this.availableEssencePoints !== 0) return false;

        // All skill points allocated (no remaining points in any essence)
        if (this.totalSkillPointsAvailable !== 0) return false;

        // All active magic spell slots filled (if magical)
        if (this.isMagical && this.magicRank > 0) {
            const activeSlotCount = Math.min(this.magicRank, 6);
            for (let i = 0; i < activeSlotCount; i++) {
                if (!this.masteredSpells[i]) return false;
            }
        }

        // Earth Pony must have chosen a general perk
        if (this.origin === 'Earth Pony' && this.generalPerks.length === 0) return false;

        // At least 1 influence selected
        if (this.influences.length === 0 || !this.influences[0]) return false;

        return true;
    }

    // Persistence state
    locked = $state(false);
    id = $state<string | null>(null);

    /** Serialize all character data to JSON */
    serialize(): string {
        return JSON.stringify({
            name: this.name,
            pronouns: this.pronouns,
            description: this.description,
            origin: this.origin,
            role: this.role,
            cutieMark: this.cutieMark,
            languages: this.languages,
            movement: this.movement,
            startingPoints: this.startingPoints,
            baseEssenceStr: this.baseEssenceStr,
            baseEssenceSpd: this.baseEssenceSpd,
            baseEssenceSma: this.baseEssenceSma,
            baseEssenceSoc: this.baseEssenceSoc,
            diamondEssence: this.diamondEssence,
            goldEssence: this.goldEssence,
            earthPonyEssence: this.earthPonyEssence,
            adaptableEssence: this.adaptableEssence,
            honestyEssence: this.honestyEssence,
            kindnessSkill: this.kindnessSkill,
            skills: this.skills,
            specializations: this.specializations,
            influences: this.influences,
            hangup: this.hangup,
            backgroundBonds: this.backgroundBonds,
            generalPerks: this.generalPerks,
            generalPerkChoices: this.generalPerkChoices,
            magicRank: this.magicRank,
            masteredSpells: this.masteredSpells,
            attacks: this.attacks,
            perks: this.perks,
        });
    }

    /** Deserialize from JSON and create a locked character instance */
    static fromJSON(json: string, id: string): CharacterStore {
        const store = new CharacterStore();
        const data = JSON.parse(json);
        store.name = data.name ?? '';
        store.pronouns = data.pronouns ?? '';
        store.description = data.description ?? '';
        store.origin = data.origin ?? '';
        store.role = data.role ?? '';
        store.cutieMark = data.cutieMark ?? 'cutiemarks/random_choice.svg';
        store.languages = data.languages ?? 'Pony';
        store.movement = data.movement ?? '';
        store.startingPoints = data.startingPoints ?? 12;
        store.baseEssenceStr = data.baseEssenceStr ?? 1;
        store.baseEssenceSpd = data.baseEssenceSpd ?? 1;
        store.baseEssenceSma = data.baseEssenceSma ?? 1;
        store.baseEssenceSoc = data.baseEssenceSoc ?? 1;
        store.diamondEssence = data.diamondEssence ?? '';
        store.goldEssence = data.goldEssence ?? '';
        store.earthPonyEssence = data.earthPonyEssence ?? 'strength';
        store.adaptableEssence = data.adaptableEssence ?? 'strength';
        store.honestyEssence = data.honestyEssence ?? 'strength';
        store.kindnessSkill = data.kindnessSkill ?? 'alertness';
        store.skills = data.skills ?? {};
        store.specializations = data.specializations ?? {};
        store.influences = data.influences ?? [];
        store.hangup = data.hangup ?? '';
        store.backgroundBonds = data.backgroundBonds ?? [];
        store.generalPerks = data.generalPerks ?? [];
        store.generalPerkChoices = data.generalPerkChoices ?? {};
        store.magicRank = data.magicRank ?? 0;
        store.masteredSpells = data.masteredSpells ?? Array(8).fill('');
        store.attacks =
            data.attacks ??
            Array(3)
                .fill(null)
                .map(() => ({ name: '', range: '', attack: '', effects: '', notes: '' }));
        store.perks = data.perks ?? [];
        store.id = id;
        store.locked = true;
        return store;
    }

    /** Reset to blank state */
    reset(): void {
        this.name = '';
        this.pronouns = '';
        this.description = '';
        this.origin = '';
        this.role = '';
        this.cutieMark = 'cutiemarks/random_choice.svg';
        this.languages = 'Pony';
        this.movement = '';
        this.startingPoints = 12;
        this.baseEssenceStr = 1;
        this.baseEssenceSpd = 1;
        this.baseEssenceSma = 1;
        this.baseEssenceSoc = 1;
        this.diamondEssence = '';
        this.goldEssence = '';
        this.earthPonyEssence = 'strength';
        this.adaptableEssence = 'strength';
        this.honestyEssence = 'strength';
        this.kindnessSkill = 'alertness';
        this.skills = {};
        this.specializations = {};
        this.influences = [];
        this.hangup = '';
        this.backgroundBonds = [];
        this.generalPerks = [];
        this.generalPerkChoices = {};
        this.magicRank = 0;
        this.masteredSpells = Array(8).fill('');
        this.attacks = Array(3)
            .fill(null)
            .map(() => ({ name: '', range: '', attack: '', effects: '', notes: '' }));
        this.perks = [];
        this.id = null;
        this.locked = false;
    }

    /** Whether the user has entered any data (for unsaved changes warning) */
    get hasAnyInput(): boolean {
        return !!(this.name.trim() || this.origin || this.role);
    }
}

export const character = new CharacterStore();
