/** Spells from the MLP RPG Core Rulebook (pp. 135–140) */

export type SpellTier = 'Elementary' | 'Superior' | 'Virtuoso';
export type SpellCircle = 'Aid' | 'Beam' | 'Enchantment' | 'Utility';

export interface SpellAttackData {
	range: string;
	attack: string;
	effects: string;
	notes: string;
}

export interface Spell {
	name: string;
	circle: SpellCircle;
	tier: SpellTier;
	/** One-line summary of what the spell does */
	shortDescription: string;
	/** Cost/duration/range line */
	stats: string;
	/** Full effect description */
	description: string;
	/** If present, this spell auto-fills an attack table row */
	attackData?: SpellAttackData;
}

/** Minimum spellcasting rank required to learn a spell of each tier */
export const TIER_MIN_RANK: Record<SpellTier, number> = {
	Elementary: 1, // D2
	Superior: 3, // D6
	Virtuoso: 5, // D10
};

export const SPELLS: Spell[] = [
	// ── Elementary Spells ──────────────────────────────────────────
	{
		name: 'Adapt',
		circle: 'Enchantment',
		tier: 'Elementary',
		shortDescription: "You cover a creature's basic needs to live in a different place.",
		stats: '↓3 Spellcasting, 1 day, 30ft',
		description:
			"Target creature gains a feature that allows them to survive in an environment they normally couldn't. This could be cloud walking in Cloudsdale, gills to breathe underwater, heat resistance in a dragon lava tube home, nightvision in a cave, or even a space suit in space.",
	},
	{
		name: 'Automate',
		circle: 'Utility',
		tier: 'Elementary',
		shortDescription: 'You bring tools to life.',
		stats: '↓1 Spellcasting, 1 scene, 30ft',
		description:
			"An object you target performs the task it was designed for. A broom sweeps, a candle lights, a whisk whisks, for the duration of the spell. As long as you supervise the object, you can issue it directions that relate to the object's function. If you cast this spell multiple times, you take ↓1 Spellcasting per additional object that you automate.",
	},
	{
		name: 'Barreling Beam',
		circle: 'Beam',
		tier: 'Elementary',
		shortDescription: 'Your beam is wide and strong enough to move creatures.',
		stats: '↓3 Spellcasting, Instant, 60ft',
		description:
			"Make a Spellcasting Attack Test against a target within range. On a success, you move your target up to 15ft away. If you are moving them into harm's way, such as over a cliff or into an electrified waterfall, you only push them up to the edge of the hazard unless your Spellcasting roll was a Critical Success. If you aren't pushing them into danger, then your target is knocked Prone on a Critical Success.",
		attackData: { range: '60ft', attack: '—', effects: 'Push 15ft', notes: 'Spellcasting' },
	},
	{
		name: 'Common Ground',
		circle: 'Enchantment',
		tier: 'Elementary',
		shortDescription: 'You and a creature learn to communicate.',
		stats: '↓2 Spellcasting, 1 scene, Line of Sight',
		description:
			"You and another creature can talk to one another. If you do not share a language, you each become fluent in the other's first language. If the creature is too set in their ways to listen, you open their mind to your way of thinking. This does not guarantee the creature will agree with you, but they will understand you.",
	},
	{
		name: 'Enchant',
		circle: 'Enchantment',
		tier: 'Elementary',
		shortDescription: 'A creature better understands how to perform a task.',
		stats: '↓1 Spellcasting, 3 rounds, Line of Sight',
		description: 'The target creature gains ↑1 in a Skill of your choice.',
	},
	{
		name: 'Energy Beam',
		circle: 'Beam',
		tier: 'Elementary',
		shortDescription: 'You unleash a beam of colorful energy.',
		stats: '↓1 Spellcasting, Instant, 30ft',
		description:
			'Make a Spellcasting Attack Test against a target within range. On a success, you deal 1 Energy damage.',
		attackData: { range: '30ft', attack: '1', effects: 'Energy', notes: 'Spellcasting' },
	},
	{
		name: 'Fluttery Wings',
		circle: 'Aid',
		tier: 'Elementary',
		shortDescription: 'You gift grounded creatures with beautiful wings.',
		stats: '↓2 Spellcasting, 1 day, Line of Sight',
		description: 'The target creature grows wings like a butterfly, gaining 15ft Aerial movement.',
	},
	{
		name: 'Healing Bandages',
		circle: 'Aid',
		tier: 'Elementary',
		shortDescription: 'Your touch is able to heal wounds.',
		stats: '↓3 Spellcasting, Instant, Reach',
		description: 'The target creature Heals 2 damage.',
	},
	{
		name: 'Help Yourself',
		circle: 'Utility',
		tier: 'Elementary',
		shortDescription: 'You call forth a magical helper.',
		stats: '↓2 Spellcasting, 1 scene, 15ft',
		description:
			"An illusory clone of yourself that seeks to help appears anywhere within the range of the spell. This clone is mostly intangible and immune to anything but magical damage. It uses the same statistics as the caster if required and disappears before the duration if 'killed'. The clone can do nothing except Lend Assistance, which it can do once each round to anyone within 15 feet of the caster that the caster indicates for as long as the duration.",
	},
	{
		name: 'Lancing Beam',
		circle: 'Beam',
		tier: 'Elementary',
		shortDescription: 'You fire a long range beam of concentrated energy.',
		stats: '↓2 Spellcasting, Instant, 60ft',
		description:
			'Make a Spellcasting Attack Test against a target within range. On a success, you deal 1 Energy damage.',
		attackData: { range: '60ft', attack: '1', effects: 'Energy', notes: 'Spellcasting' },
	},
	{
		name: 'Summon Shield',
		circle: 'Aid',
		tier: 'Elementary',
		shortDescription: 'You raise a defensive barrier between a creature and any incoming attack.',
		stats: '↓1 Spellcasting, 2 rounds, 30ft',
		description:
			'The target creature within range gets a +2 bonus to Toughness and Evasion for the duration of the spell.',
	},
	{
		name: 'Teleport',
		circle: 'Utility',
		tier: 'Elementary',
		shortDescription:
			'You disappear in a flash of light, reappearing somewhere nearby a split second later.',
		stats: '↓3 Spellcasting, Instant, Line of Sight',
		description:
			"You arrive in any space within range as long as there isn't a creature or object there. If the space is occupied you appear as close as possible to your target in an unoccupied area.",
	},

	// ── Superior Spells ────────────────────────────────────────────
	{
		name: 'Bestow Expertise',
		circle: 'Enchantment',
		tier: 'Superior',
		shortDescription: "You fill a pony's mind with wisdom and experience.",
		stats: '↓2 Spellcasting, 1 scene, Line of Sight',
		description:
			'The target pony gains a Specialization of your choice for any Skill for the duration of the spell.',
	},
	{
		name: "Don't-Notice-Me-Field",
		circle: 'Enchantment',
		tier: 'Superior',
		shortDescription: 'You make a creature harder to detect.',
		stats: '↓3 Spellcasting, 1 scene, 30ft',
		description:
			'The target of this spell becomes silent and invisible. They gain Edge on Infiltration Skill Tests related to not being seen, and creatures looking for them suffer Snag on Awareness Skill Tests to notice them. This spell stops working if the target harms another creature, or if the target is affected by even stronger magic.',
	},
	{
		name: 'Explosive Beam',
		circle: 'Beam',
		tier: 'Superior',
		shortDescription:
			'You aim your beam at an area instead of a creature, affecting all creatures in that area.',
		stats: '↓3 Spellcasting, Instant, 60ft',
		description:
			'Pick a space within range. Make a Spellcasting Attack Test against each target in a 15ft diameter circle of the chosen space. You deal 1 Energy damage to each target successfully attacked.',
		attackData: { range: '60ft', attack: '1', effects: 'Energy (AoE)', notes: 'Spellcasting' },
	},
	{
		name: 'Hitch a Ride',
		circle: 'Utility',
		tier: 'Superior',
		shortDescription: 'When you have to get somewhere, you ride in style.',
		stats: '↓3 Spellcasting, 1 day, 20ft',
		description:
			"You summon a magical vehicle that appears in an unoccupied space within the spell's range. It is large enough for you and 9 other Common sized creatures to travel comfortably. This vehicle drives itself, has a d10 Driving Skill, is Specialized in Driving itself, and has a Ground and Aerial movement of 60ft.",
	},
	{
		name: 'Summon Armor',
		circle: 'Aid',
		tier: 'Superior',
		shortDescription: 'You encase a creature in a magical form fitting, protective shell.',
		stats: '↓2 Spellcasting, 1 scene, 30ft',
		description:
			'Target creature gains a +2 bonus to Toughness and Evasion for the duration of the spell.',
	},
	{
		name: 'Take Record',
		circle: 'Utility',
		tier: 'Superior',
		shortDescription: 'You record what you witness.',
		stats: '↓2 Spellcasting, 1 scene, Range of your senses',
		description:
			'You create an account of your experience that can be preserved and shared. This could take the form of an illusion recreating the scene you recorded, a book detailing the events, an epic painting, or some other visual method for conferring what was recorded to others.',
	},
	{
		name: 'Teleporting Beam',
		circle: 'Beam',
		tier: 'Superior',
		shortDescription: 'Your beam magically relocates whatever it hits.',
		stats: '↓2 Spellcasting, Instant, 60ft',
		description:
			'Make a Spellcasting Attack Test against a target creature or object within range. On a success, you move your target instantly to any space within range of your Beam without a creature or object in it.',
		attackData: { range: '60ft', attack: '—', effects: 'Teleport', notes: 'Spellcasting' },
	},
	{
		name: 'Wayfinder',
		circle: 'Aid',
		tier: 'Superior',
		shortDescription: 'An external indicator directs you to your destination.',
		stats: '↓2 Spellcasting, 1 scene, Unlimited',
		description:
			"Pick a creature, place, or thing that you are familiar with. If you succeed at a Spellcasting Skill Test, you become magically aware of the shortest route to the current location of this creature, place, or thing. During the spell's duration you also know if the focus is being moved and the spell automatically recalculates the route.",
	},

	// ── Virtuoso Spells ────────────────────────────────────────────
	{
		name: 'Beam Volley',
		circle: 'Beam',
		tier: 'Virtuoso',
		shortDescription: 'You fire a barrage of magical beams.',
		stats: '↓4 Spellcasting, Instant, Line of Sight',
		description:
			'Make a Spellcasting Attack Test against 3 targets in range. You deal 2 Energy Damage to each target you successfully hit.',
		attackData: {
			range: 'Line of Sight',
			attack: '2',
			effects: 'Energy (x3)',
			notes: 'Spellcasting',
		},
	},
	{
		name: 'Extra Sensory Projection',
		circle: 'Utility',
		tier: 'Virtuoso',
		shortDescription: 'You leave your body behind and visit a far off location with your mind.',
		stats: '↓4 Spellcasting, 10 rounds, Unlimited',
		description:
			'Pick a creature, place, or thing that you are familiar with. A clearly magical projection of your body manifests in that location. You can see and can communicate in that location, as if you were there. While the spell is active you are aware of what is going on at both locations, but those at both locations can see and hear everything you do.',
	},
	{
		name: 'Harmony Unleashed',
		circle: 'Aid',
		tier: 'Virtuoso',
		shortDescription:
			"You ignite the spark that's inside of a pony, unleashing their inner element of harmony.",
		stats: '↓3 Spellcasting, 3 rounds, 30ft',
		description:
			"Casting this spell creates a colorful glow that projects the target pony's personal perception of their best self. Any actions the target pony takes during the spell's duration that are tied to their Cutie Mark Perk are considered Free actions.",
	},
	{
		name: 'Lightning Speed',
		circle: 'Utility',
		tier: 'Virtuoso',
		shortDescription: 'You experience a burst of speed.',
		stats: '↓3 Spellcasting, 1 scene, 30ft',
		description:
			'Target any creature within range. That creature doubles all their Movement rates for the duration of the spell.',
	},
	{
		name: 'Mind Beam',
		circle: 'Beam',
		tier: 'Virtuoso',
		shortDescription: "Your beam affects your target's mind instead of their body.",
		stats: '↓3 Spellcasting, 3 rounds, 60ft',
		description:
			'When you Master Mind Beam, pick one of the following effects: Calm, Confuse, Frighten, Impair, or Stunned. This is the default effect of your Mind Beam. You may use any of the other effects instead but doing so increases the cost by ↓1. The beam targets a single creature within range.',
		attackData: { range: '60ft', attack: '—', effects: 'Condition', notes: 'Spellcasting' },
	},
	{
		name: 'Panacea',
		circle: 'Aid',
		tier: 'Virtuoso',
		shortDescription: 'You cure a creature of all ills.',
		stats: '↓4 Spellcasting, Instant, 30ft',
		description:
			'Target any creature within range. All conditions affecting the target creature end, including Defeated, and the creature returns to their full Health.',
	},
	{
		name: 'Ponymorph',
		circle: 'Enchantment',
		tier: 'Virtuoso',
		shortDescription: 'The creature takes on the appearance of another creature.',
		stats: '↓4 Spellcasting, 1 scene, 20ft',
		description:
			'This spell turns the target creature within range into an identical copy of another creature of their size. They look, sound and even smell exactly like the original. They gain Edge on Deception and Infiltration Skill Tests to pass as the creature they look like. The target does not gain any magical abilities of the creature they are copying, but they do gain physical abilities.',
	},
	{
		name: 'Self Improvement',
		circle: 'Enchantment',
		tier: 'Virtuoso',
		shortDescription: "You better yourself, or some other creature's self.",
		stats: '↓3 Spellcasting, 1 scene, 30ft',
		description:
			'The target creature within range improves one of their Strength, Speed, Smarts, or Social Essence Scores by 1, for the duration of the spell. The creature gains a Skill Point and an increase to Defense, as they usually do for an Essence Score Increase, but only for the duration of the spell.',
	},
];
