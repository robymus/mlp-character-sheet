import type { EssenceType } from '../store.svelte';

export interface GeneralPerk {
	name: string;
	shortDescription: string;
	fullDescription: string;
	prerequisite?: {
		essence?: Partial<Record<EssenceType, number>>;
		skill?: Record<string, number>; // skill name -> min rank (1=d2, 2=d4, 3=d6, etc.)
		special?: string; // for display-only prereqs like "Aerial 50ft"
	};
	choices?: string[];
	choiceLabel?: string;
	repeatable?: number; // max times (omit = 1)
	note?: string;
}

export const GENERAL_PERKS: GeneralPerk[] = [
	{
		name: 'Acute Sense',
		shortDescription:
			'Edge on Alertness Tests where your chosen sense applies. ↑1 on non-Alertness Tests your sense applies to.',
		fullDescription:
			'One of your five senses is much stronger than average. Choose sight, sound, smell, taste, or touch. You gain Edge on Alertness Skill Tests where your chosen sense applies, and ↑1 on non-Alertness Skill Tests your chosen sense applies to.',
		choices: ['Sight', 'Sound', 'Smell', 'Taste', 'Touch'],
		choiceLabel: 'Choose a sense:',
		repeatable: 5,
	},
	{
		name: 'Adolescent Attitude',
		shortDescription:
			'Reroll 1s on Social Skill Tests. Once per scene, roll an untrained Skill Test as d2.',
		fullDescription:
			'Finding your place in the world. You may reroll 1s on Skill dice used for Social Skill Tests. Once per scene, you can roll an untrained Skill Test as if you had a d2 Rank.',
	},
	{
		name: 'Always Alert',
		shortDescription: "Edge on Initiative. Can't be Surprised while conscious.",
		fullDescription:
			"Always aware of your surroundings. You gain Edge on Initiative Skill Tests. You can't be Surprised as long as you are conscious.",
	},
	{
		name: 'Animal Friend',
		shortDescription:
			'Always considered to have a Specialization when dealing socially with animals.',
		fullDescription:
			'You see wild animals as just as important and social as ponies. When dealing socially with an animal, you are always considered to have a Specialization.',
	},
	{
		name: 'Animal Pet',
		shortDescription: 'You gain a loyal animal pet that follows you everywhere.',
		fullDescription:
			'Wherever you go, a loyal animal follows you. You gain an animal pet. You can take this Perk up to three times, each time gaining a new pet or improving a single pet with a new advance.',
		prerequisite: { skill: { animal_handling: 2 } },
		repeatable: 3,
		note: 'Please discuss your pet with the GM.',
	},
	{
		name: 'Baker',
		shortDescription: 'Use Culture or Performance in place of Wealth Tests for food.',
		fullDescription:
			"When you don't have a recipe in the oven, you have one in mind. You can use Culture or Perform Skill Tests in place of Wealth Tests when the Test is related to food.",
	},
	{
		name: 'Bowl Over',
		shortDescription: 'Free action to gain Edge when attempting to shove.',
		fullDescription:
			'You are adept at throwing your weight around. You can use a Free action to gain Edge when attempting to shove another creature.',
	},
	{
		name: 'Compassionate',
		shortDescription:
			'Edge on Diplomacy for non-aggressive solutions. Heal 1 Damage with Persuasion DIF 12. Edge on acquiring resources for others.',
		fullDescription:
			'You go out of your way to help. Edge on Diplomacy Skill Tests to suggest non-aggressive solutions. You can heal a target 1 Damage with a successful DIF 12 Persuasion Skill Test. Edge on Skill Tests to acquire food, water, medicine, or shelter for other creatures.',
		prerequisite: { essence: { social: 3 } },
	},
	{
		name: 'Dabbler',
		shortDescription:
			'Each morning, lower a Skill by 1 Rank and increase another Skill of the same Essence by 1 Rank.',
		fullDescription:
			'You change your mind as often as you change your clothes. Every morning, you can choose to lower a Skill by 1 Rank and increase another Skill of the same Essence Score (or your Spellcasting skill) by 1 Rank. This change reverts back to normal when you wake the next day.',
	},
	{
		name: 'Dig Deep',
		shortDescription:
			'Once per scene, ignore 1 Damage (with Snag on all Tests). Once per scene, restore 1d2 Health by forfeiting your turn.',
		fullDescription:
			'You have a deep reserve of fighting spirit. Once per scene, you can ignore 1 Damage by suffering Snag on all Skill Tests until the end of your next turn. Once per scene, you can restore 1d2 Health by forfeiting your entire turn.',
	},
	{
		name: 'Dodgy',
		shortDescription: '+2 Evasion. If you move ≤5ft, you may Defend as a Free action.',
		fullDescription:
			'Fast and nimble on your hooves. A +2 bonus to your Evasion. On any round where you do not move more than 5 feet you may Defend as a Free action.',
		prerequisite: { essence: { speed: 3 } },
	},
	{
		name: 'Dress Maker',
		shortDescription:
			'Use Culture or Performance in place of Wealth Tests for clothing and accessories.',
		fullDescription:
			'You always dress for the occasion. You can use Culture or Perform Skill Tests in place of Wealth Tests to buy clothing and fashion accessories.',
	},
	{
		name: 'Educated',
		shortDescription:
			'+1 Friendship Point per session. Once per day, act as if you have a Specialization in any Smarts Skill.',
		fullDescription:
			"You have learned a lot from being in school. Add an additional Friendship Point to your team's pool each game session. Once per day, you can act as though you have a Specialization in any Smarts Skill.",
		prerequisite: { essence: { smarts: 3 } },
	},
	{
		name: 'Expertise',
		shortDescription:
			'Choose a Skill (d4+): ignore first ↓1 on Skill Tests and reroll 1s on Skill dice.',
		fullDescription:
			'You have been practicing diligently. Choose a Skill with d4 Rank or higher. Ignore the first ↓1 dice downshift applied to your Skill Tests. You may reroll 1s on any Skill dice rolled. You may take this Perk up to three times, but for different Skills.',
		prerequisite: { special: 'A Skill at d4 or higher' },
		repeatable: 3,
	},
	{
		name: 'Farmer',
		shortDescription: 'Use Brawn or Survival in place of Wealth Tests for simple, practical items.',
		fullDescription:
			'You learned at a young age how to live off the land. You can use Brawn or Survival Skill Tests in place of Wealth Tests related to buying simple, practical items.',
	},
	{
		name: 'Fast',
		shortDescription: '+2 to Initiative. +10ft to one movement type you already possess.',
		fullDescription:
			'You are incredibly quick. You gain a +2 bonus to Initiative Skill Tests. Choose one movement type you already possess and increase it by 10 feet.',
	},
	{
		name: 'Fearsome',
		shortDescription: 'Intimidation counts as a Social Skill too. ↑1 on Intimidation Tests.',
		fullDescription:
			'You make other creatures nervous. Intimidation is a Social Skill for you, in addition to being a Strength Skill. You gain ↑1 on Intimidation Skill Tests with your hard stare.',
	},
	{
		name: 'Frenemy',
		shortDescription: "Abilities that target 'a friend' can target any creature instead.",
		fullDescription:
			"Sometimes, you know your enemies as well as your friends. When you use an ability that targets 'a friend', you can instead target any creature with it, even if you don't know them very well or you don't get along.",
	},
	{
		name: 'Gallant',
		shortDescription:
			'↑1 on Social Tests in non-aggressive scenes where your style might influence others.',
		fullDescription:
			'You dress for the occasion, and yet you always stand out. You gain ↑1 on Social Skill Tests in Scenes where no creatures are acting aggressively and your style might influence how other creatures act.',
	},
	{
		name: 'Healthy Cooking',
		shortDescription:
			'Use Culture or Performance in place of Science to Heal in non-aggressive scenes.',
		fullDescription:
			"Not only are your recipes delicious, they're good for you! You can use Culture or Perform in place of Science Skill Tests to Heal damage in scenes where no creatures are acting aggressively.",
	},
	{
		name: 'Illusionist',
		shortDescription:
			'Appear to cast Elementary/Superior spells using Deception or Science (illusion only, no real effect).',
		fullDescription:
			"You are not a magical pony, but don't tell anypony that. You may appear to cast any Elementary or Superior spell, using a Deception or Science Skill Test instead of Spellcasting. On a success, onlookers believe you have actually cast the spell. However, the spells only appear to work — they don't actually deal damage, heal, fly, or read minds.",
	},
	{
		name: 'Inspired',
		shortDescription: 'Reroll any one die (any die at all) once per day.',
		fullDescription:
			'You are driven to do great things, and it shows. You may reroll one die (any die at all) once per day.',
	},
	{
		name: 'Iron Hooves',
		shortDescription: 'Your unarmed attacks deal +1 Damage.',
		fullDescription: 'Your kicks strike hard and true. Your unarmed attacks deal +1 Damage.',
		prerequisite: { essence: { strength: 3 } },
	},
	{
		name: 'Luck',
		shortDescription:
			'Re-roll any natural 1 on any Skill Die of d4 or higher. Must accept the second result.',
		fullDescription:
			'You must have been born under a lucky sign. You may re-roll any natural 1 on any Skill Die of d4 or higher you roll. You must accept the second result.',
	},
	{
		name: 'Magical',
		shortDescription:
			'You are a magical pony capable of casting spells. Unlocks the Spellcasting skill and spell slots.',
		fullDescription:
			'You are a magical pony and are capable of casting spells. When you invest Skill Points into the Spellcasting Skill, you also Master a spell. You can only Master a Superior spell when you have at least d6 in Spellcasting, and a Virtuoso spell when you have a d10 in Spellcasting.',
	},
	{
		name: 'Prankster',
		shortDescription: 'Edge on Social Tests against Surprised creatures.',
		fullDescription:
			'When somepony lets their guard down around you, they leave themselves open for a prank. You gain Edge on any Social Skill Tests made against Surprised creatures.',
	},
	{
		name: 'Quick Thinker',
		shortDescription: 'Free actions per turn = Smarts − 2 instead of Speed − 2.',
		fullDescription:
			"You've always been a smart cookie. On your turn, you gain a number of Free actions equal to your Smarts Essence minus 2, instead of your Speed Essence minus 2.",
	},
	{
		name: 'Super Specialized',
		shortDescription: '↑1 with a chosen Skill when your Specializations apply.',
		fullDescription:
			'You are exceptionally focused. Choose a Skill you have at least one Specialization in. You gain ↑1 with that Skill when your Specializations apply.',
	},
	{
		name: 'Talented',
		shortDescription:
			'Choose a Specialization as a Talent: Standard→Move, Move→Free, Free→No action. Usable once per scene per time taken.',
		fullDescription:
			"You've worked your hooves hard to improve your technique. Choose a Specialization; this is now considered one of your Talents. Once per scene, you can use a Standard action related to your Talents as a Move action instead, a Move action as a Free action, and a Free action as no action at all. You can take this Perk multiple times.",
		repeatable: 10,
	},
	{
		name: 'Wealth',
		shortDescription:
			'Once per session, auto-pass a Skill Test that can be bought. Edge on Social Tests flaunting wealth. Wealth status improves by 1 level.',
		fullDescription:
			'Your purse runs over with bits. Once per game session, you may choose to automatically pass any Skill Tests whose success could be bought. You gain Edge on Social Skill Tests where you can flaunt your wealth. Improve your wealth status by 1 level (you may take this Perk again to improve further).',
		repeatable: 5,
	},
];

export const GENERAL_PERK_NAMES = GENERAL_PERKS.map((p) => p.name);
