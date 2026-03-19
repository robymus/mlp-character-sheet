/** Suggested specializations per skill, from the MLP RPG Core Rulebook (pp. 101–108) */

export interface Specialization {
    name: string;
    description: string;
}

export const SKILL_SPECIALIZATIONS: Record<string, Specialization[]> = {
    // STRENGTH
    athletics: [
        {
            name: 'Climbing',
            description:
                'The grip strength to handle hoofholds, test the stability of a rockface by touch, and pull your whole body up vertical surfaces.',
        },
        {
            name: 'Trotting',
            description:
                'Maintaining a steady pace or long distances, and accelerating to great speeds in a short time.',
        },
        {
            name: 'Sport',
            description:
                'Choose a specific sport as your Specialization, like buckball. You see the world as one big game of that sport, and look for opportunities to ply your expertise.',
        },
        {
            name: 'Swimming',
            description: 'Crossing and performing in water.',
        },
    ],
    brawn: [
        {
            name: 'Carry',
            description:
                'Picking up significant weight and moving with it. It is a DIF 18 Skill Test to carry double your Carrying Weight for 1 minute; DIF 28 to triple, etc.',
        },
        {
            name: 'Drag',
            description:
                'Pulling significant weight behind you while moving, most often using rope, ties, a yoke, etc. It is a DIF 10 Skill Test to drag double your Carrying Weight at half Movement rate for one minute; DIF 20 to triple, 30 to quadruple, etc.',
        },
        {
            name: 'Lift',
            description:
                'Picking up significant weight while stationary. It is a DIF 14 Skill Test to lift double your Carrying Weight for 1 minute; DIF 28 to triple, etc.',
        },
    ],
    conditioning: [],
    intimidation: [
        {
            name: 'Distract',
            description: 'Pull focus away from anything that is not you.',
        },
        {
            name: 'Frighten',
            description: 'Imply a threat through body language and posturing.',
        },
        {
            name: 'Taunt',
            description: 'Put your physical presence on display in a condescending way.',
        },
    ],
    might: [
        {
            name: 'Grappling',
            description:
                'Restraining a target by overpowering them and limiting how they can move.',
        },
        {
            name: 'Shoving',
            description: 'Pushing a creature back against their will.',
        },
        {
            name: 'Unarmed Combat',
            description: 'Directed force meant to cause harm.',
        },
        {
            name: 'Melee Weapon',
            description: 'Specialize in a particular close combat weapon, like a sword or club.',
        },
    ],

    // SPEED
    acrobatics: [
        {
            name: 'Balance',
            description: 'Maintaining footing regardless of circumstances.',
        },
        {
            name: 'Flying',
            description:
                'Turning, diving, and flipping in three-dimensional space using air movement.',
        },
        {
            name: 'Gymnastics',
            description: 'Graceful, often performative movements.',
        },
    ],
    driving: [
        {
            name: 'Air Vehicle',
            description: 'Navigating the open air, including take-off, and, especially, landing.',
        },
        {
            name: 'Land Vehicle',
            description:
                'You understand how to navigate a bumpy road, maintain your speed going uphill or down, and keeping your passengers comfortable for the ride.',
        },
        {
            name: 'Sea Vehicle',
            description:
                'Piloting a seacraft across the surface of water, and watching for telltale signs of shallow pools.',
        },
    ],
    finesse: [
        {
            name: 'Coordination',
            description: 'When the order of a series of complex movements matters.',
        },
        {
            name: 'Martial Arts',
            description:
                'Strikes, throws, and weapon attacks that need a measured hoof rather than unbridled power.',
        },
        {
            name: 'Steady Hoof',
            description:
                'The more precise the movement, the more comfortable you are executing it.',
        },
    ],
    infiltration: [
        {
            name: 'Burglary',
            description: 'Picking locks, moving around undetected, and leaving without a trace.',
        },
        {
            name: 'Shadowing',
            description: 'Watching and following a target unnoticed.',
        },
        {
            name: 'Sleight of Hoof',
            description:
                'Hiding small objects while being observed, sometimes as a performance like in a stage magic act.',
        },
        {
            name: 'Stealth',
            description: 'Moving and acting unusually quietly.',
        },
    ],
    initiative: [],
    targeting: [
        {
            name: 'Kicking',
            description:
                'Directing the force of your kick to launch a projectile, such as to knock a ball through a hoop. Often called Bucking.',
        },
        {
            name: 'Ranged Weapon',
            description: 'Firing a ranged weapon, such as a bow or a catapult.',
        },
        {
            name: 'Trajectory',
            description:
                'Calculating the verticals and horizontals, and where incoming fire came from.',
        },
    ],

    // SMARTS
    alertness: [
        {
            name: 'Insight',
            description:
                "Judging another's intentions, noticing patterns in speech or behavior, and otherwise determining what a creature believes to be true or false.",
        },
        {
            name: 'Investigation',
            description: 'Search for clues, details, hidden images, or other secrets.',
        },
        {
            name: 'Perception',
            description:
                'Taking in a scene with a quick pass. Not a deep search for specifics, but rather the general makeup of a situation.',
        },
    ],
    culture: [
        {
            name: 'Cuisine',
            description:
                "Understanding cooking traditions from around the world, tracing a plate's origin by its flavor, and the preparation of cuisine.",
        },
        {
            name: 'Fashion',
            description:
                'Intimate familiarity with the origins \u2013 both historic and geographical \u2013 of different materials, cuts, and styles, and the techniques of haute couture.',
        },
        {
            name: 'History',
            description:
                'The order of events, and how time connects seemingly unrelated events in surprising ways.',
        },
        {
            name: 'Linguistics',
            description: 'Understanding other languages.',
        },
        {
            name: 'Specific Culture',
            description:
                "The cuisine, fashion, and history of a specific culture, from that culture's perspective, such as the holidays of Yakyakistan or the trading culture of Klugetown.",
        },
    ],
    science: [
        {
            name: 'Medicine',
            description: 'Knowledge of anatomy, diagnosis, care, and treatment.',
        },
        {
            name: 'Research',
            description:
                "The science of study, because they say intelligence isn't knowing all the answers, it's knowing how to find any answer.",
        },
        {
            name: 'Specific Subject',
            description:
                'A specific scientific discipline, like Biology, Chemistry, or Mathematics.',
        },
    ],
    survival: [
        {
            name: 'Cartography',
            description: 'Drawing maps and reading the terrain.',
        },
        {
            name: 'Foraging',
            description: 'Gathering food and drink from the wild.',
        },
        {
            name: 'Meteorology',
            description: 'Noticing and predicting weather patterns.',
        },
        {
            name: 'Specific Environment',
            description:
                'Navigating and living comfortably in a specific environment, such as deserts, forests, or at sea.',
        },
    ],
    technology: [
        {
            name: 'Engineering',
            description: 'Building and repairing technology.',
        },
        {
            name: 'Simple Machines',
            description:
                'Deep understanding of the basics of technology: the lever, inclined plane, pulley, screw, wedge, and wheel and axle.',
        },
        {
            name: 'Theoretical Technology',
            description:
                'When you let your imagination run wild, you can picture a self-driving cart at every home, and aircrafts that fly faster than hot air balloons.',
        },
    ],

    // SOCIAL
    animal_handling: [
        {
            name: 'Domesticated Pets',
            description:
                'Small creatures who can be taught to be calm enough to join the family, such as rabbits and dogs.',
        },
        {
            name: 'Mythical Creatures',
            description:
                'Creatures with a touch of magic to their origins, such as star spiders and phoenixes.',
        },
        {
            name: 'Wild Animals',
            description:
                'Aggressive animals that live by rules most ponies misunderstand, such as hydras and tatzlwurms.',
        },
    ],
    deception: [
        {
            name: 'Bluffing',
            description: 'Lying without raising suspicion or accidentally revealing a truth.',
        },
        {
            name: 'Disguise',
            description:
                'Alter appearance or how you carry yourself to come off as somepony different.',
        },
        {
            name: 'Misdirect',
            description:
                'Planting an idea in a way that makes somepony believe they thought it up.',
        },
    ],
    performance: [
        {
            name: 'Career Art',
            description:
                'A practical career infused with such creativity, it becomes art, like cuisine, fashion, and influencer.',
        },
        {
            name: 'Literary Art',
            description:
                'Writing meant to be read, either by a performer or the audience, such as a comic, novel, poem, or script.',
        },
        {
            name: 'Performing Art',
            description:
                'A performance viewed as it is created, although usually after much practice, such as acting, dancing, and music.',
        },
        {
            name: 'Visual Art',
            description:
                'A performance meant to be regarded after it is completed, such as architecture, ceramics, drawing, painting, photography, and sculpting.',
        },
    ],
    persuasion: [
        {
            name: 'Diplomacy',
            description:
                'Formal interaction with official intent, like peacemaking or trade negotiations.',
        },
        {
            name: 'Etiquette',
            description:
                'Social interaction with specific rules of behavior, like how to address a princess.',
        },
        {
            name: 'Understanding',
            description: 'Active listening and perspective-taking.',
        },
    ],
    streetwise: [
        {
            name: 'Connections',
            description:
                'Using family, friends, and associates that you trust at least a little to find out what you want to know.',
        },
        {
            name: 'Gossip',
            description:
                "Tapping into public opinion and listening in on whispers that shouldn't be spoken out loud.",
        },
        {
            name: 'Underworld',
            description:
                'While Equestria is a nice place, there are a few bad apples; you know who they are and where to find them.',
        },
    ],
};
