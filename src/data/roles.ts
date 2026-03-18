export type RoleType = 
    | 'Spirit of Generosity'
    | 'Spirit of Honesty'
    | 'Spirit of Kindness'
    | 'Spirit of Laughter'
    | 'Spirit of Loyalty'
    | 'Spirit of Magic';

export interface RoleData {
    name: RoleType;
    icon: string; // will map to an image or emoji later if needed
    paragraphs: { heading?: string; text: string }[];
}

export const ROLES: RoleData[] = [
    {
        name: 'Spirit of Generosity',
        icon: '💎',
        paragraphs: [
            { text: "Generosity is the element of harmony that asks ponies to give of themselves for the benefit of others. It requires ponies to be perceptive and empathetic to clearly see what others need." },
            { heading: "More Than Giving", text: "Giving away bits and objects is nice, but true generosity is giving your time, energy, and patience. It's often more performative than helpful without the right spirit." },
            { heading: "Generous Empathy", text: "Understanding what someone really needs, even if they're too embarrassed or shy to say, is a key part of the Spirit of Generosity." }
        ]
    },
    {
        name: 'Spirit of Honesty',
        icon: '🍎',
        paragraphs: [
            { text: "Honesty is the element of harmony that most ponies will agree is important, think they mean it, but do the opposite when it matters. The truth can be hard to hear. And honestly, the more important it is for somepony to hear the truth, the harder it is to say. That's why ponies who embody Honesty tend to be the toughest Spirits of Harmony." },
            { heading: "The Truth Helps", text: "They say the truth hurts. It can. But the truth can even help prevent greater hurt from a lie. A Spirit of Honesty provides the hard truths so friends can grow." },
            { heading: "Honest Trust", text: "Honesty builds unshakeable trust within a circle of friends, creating a strong foundation against the trickery of villains." }
        ]
    },
    {
        name: 'Spirit of Kindness',
        icon: '🦋',
        paragraphs: [
            { text: "A little kindness goes a long way, and it costs nothing to be kind. So why aren't more ponies kind? Because kindness takes trust. To be kind is to be vulnerable, and too many creatures think of vulnerability as weakness." },
            { heading: "Enduring Vulnerability", text: "The ponies who embody the Element of Kindness see it differently, living their lives showing how being vulnerable takes endurance. It's worth it in the end." },
            { heading: "A Kinder Equestria", text: "They believe that an Equestria with more kindness is stronger and safer than one with high walls and suspicious glares." }
        ]
    },
    {
        name: 'Spirit of Laughter',
        icon: '🎈',
        paragraphs: [
            { text: "Laughter's the best! It's like your smile takes over your whole body. You can't move. Your belly shakes. You might even laugh until you cry. And you love it! Every second of it fills you with joy, and you literally couldn't be happier." },
            { heading: "Contagious Cheer", text: "And it's contagious. Have you ever laughed at how much somepony else is laughing? Or laughed at how much you're laughing? You're not even laughing at what you thought was funny anymore." },
            { heading: "Joyous Spirit", text: "You've moved on to laughing at the pure joy of the moment, bringing light to the darkest corners of Equestria." }
        ]
    },
    {
        name: 'Spirit of Loyalty',
        icon: '⚡',
        paragraphs: [
            { text: "Nothing means more to you than your friends. If they're unhappy, you are there to cheer them up. If they're in danger, you swoop in to rescue them. If somecreature hurt them, you're about to get all up in that creature's face." },
            { heading: "Fierce Protection", text: "Your instincts can be reactionary, and sometimes your friends hold you back. There's nothing worse that upsetting a friend by helping them the wrong way." },
            { heading: "Loyal Bond", text: "The element of Loyalty may have sparked reckless actions, but the true spirit learns how to be there exactly when they are needed most." }
        ]
    },
    {
        name: 'Spirit of Magic',
        icon: '⭐',
        paragraphs: [
            { text: "The Elements of Harmony are the most powerful magic known to ponydom. Magic is both an Element of Harmony and the source of the bond between the other Elements of Harmony. It is also the most mysterious element. What is magic? In what ways does a pony who embodies magic also embody harmony?" },
            { heading: "The Mysterious Element", text: "And what is magic's connection to friendship? Even Twilight Sparkle, the first Spirit of Magic, had more questions than answers. But that's OK. Spirits of Magic love questions." },
            { heading: "An Element Apart", text: "It's easy to see how being generous, honest, kind, loyal, and making people laugh creates friendships. The Magic spirit learns that friendship itself is the highest form of magic." }
        ]
    }
];
