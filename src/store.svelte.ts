import { derived } from 'svelte/store';

// Basic Types
export type Origin = 'Earth Pony' | 'Pegasus' | 'Unicorn' | '';
export type Role = 'Spirit of Generosity' | 'Spirit of Honesty' | 'Spirit of Kindness' | 'Spirit of Laughter' | 'Spirit of Loyalty' | 'Spirit of Magic' | '';

// Core state class using Svelte 5 runes
export class CharacterStore {
    name = $state('');
    pronouns = $state('');
    level = $derived(1); // Hardcoded
    description = $state('');
    origin = $state<Origin>('');
    diamondEssence = $state<'strength'|'speed'|'smarts'|'social'|''>('');
    goldEssence = $state<'strength'|'speed'|'smarts'|'social'|''>('');
    movement = $state('');
    role = $state<Role>('');
    languages = $state('Pony');
    cutieMark = $state('/cutiemarks/random_choice.svg');
    adaptableEssence = $state<'strength'|'speed'|'smarts'|'social'>('strength');
    honestyEssence = $state<'strength'|'speed'|'smarts'|'social'>('strength');
    kindnessSkill = $state<'alertness'|'animal_handling'|'persuasion'>('alertness');
    influences = $state<string[]>([]);
    hangup = $state<string>(''); // For 2nd influence
    backgroundBonds = $state<string[]>([]);
    
    // Essences
    // The pool represents available points. A new character starts with some pool ?
    // Actually the rulebook gives 2 essence points + 1 origin point at level 1 usually, 
    // wait, we need to read the specific number from rulebook or just define a starting pool.
    // The plan didn't specify exactly the number of starting points, but it's typically a set number.
    startingPoints = $state(2); // placeholder, we will refine this
    
    baseEssenceStr = $state(0);
    baseEssenceSpd = $state(0);
    baseEssenceSma = $state(0);
    baseEssenceSoc = $state(0);

    get essenceStr() { 
      return this.baseEssenceStr + (this.origin === 'Earth Pony' ? 1 : 0) 
        + (this.diamondEssence === 'strength' ? 2 : 0) + (this.goldEssence === 'strength' ? 1 : 0); 
    }
    get essenceSpd() { 
      return this.baseEssenceSpd + (this.origin === 'Pegasus' ? 1 : 0)
        + (this.diamondEssence === 'speed' ? 2 : 0) + (this.goldEssence === 'speed' ? 1 : 0); 
    }
    get essenceSma() { 
      return this.baseEssenceSma + (this.origin === 'Unicorn' ? 1 : 0)
        + (this.diamondEssence === 'smarts' ? 2 : 0) + (this.goldEssence === 'smarts' ? 1 : 0); 
    }
    get essenceSoc() { 
      return this.baseEssenceSoc
        + (this.diamondEssence === 'social' ? 2 : 0) + (this.goldEssence === 'social' ? 1 : 0); 
    }

    get availableEssencePoints() {
      const allocated = this.baseEssenceStr + this.baseEssenceSpd + this.baseEssenceSma + this.baseEssenceSoc;
      return this.startingPoints - allocated;
    }
    
    startingSkillPoints = $state(10); // Common default for standard level characters

    // Track specializations and skills
    // We can store a map of skillName -> rank, or an array of specializations
    skills = $state<Record<string, number>>({});
    specializations = $state<Record<string, string[]>>({}); // skillName -> spec[]

    get availableSkillPoints() {
      const allocated = Object.values(this.skills).reduce((total, rank) => total + rank, 0);
      return this.startingSkillPoints - allocated;
    }

    perks = $state<string[]>([]);
    
    // Magic 
    magicRank = $state<number>(0);
    masteredSpells = $state<{name: string, spec: string, tier: string, circle: string}[]>(
      Array(8).fill(null).map(() => ({name: '', spec: '', tier: '', circle: ''}))
    );
    attacks = $state<{name: string, range: string, attack: string, effects: string, notes: string}[]>(
      Array(3).fill(null).map(() => ({name: '', range: '', attack: '', effects: '', notes: ''}))
    );
}

export const character = new CharacterStore();
