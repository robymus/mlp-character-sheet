export type RoleType =
    | 'Spirit of Generosity'
    | 'Spirit of Honesty'
    | 'Spirit of Kindness'
    | 'Spirit of Laughter'
    | 'Spirit of Loyalty'
    | 'Spirit of Magic';

export interface RoleData {
    name: RoleType;
    icon: string;
    paragraphs: { heading?: string; text: string }[];
}

export const ROLES: RoleData[] = [
    {
        name: 'Spirit of Generosity',
        icon: '💎',
        paragraphs: [
            {
                text: "You put others before yourself. It's true that this makes you feel good about yourself, and you share in the joy of others benefiting from your giving nature, but that's not why you do it. You sincerely feel that others' needs are more important than your wants. You would still feel helping those in need was the right thing to do, even if you knew they wouldn't help you in the same situation. You believe the world needs less \"what's in it for me?\" and more \"how can I help?\"",
            },
            {
                heading: 'Sharing is Caring',
                text: "The old adage is true. You share with friends, family, strangers, and even enemies because your heart overflows with care for those in your life. Whether it's bits, time, expertise, or a shoulder to cry on, you are willing to give what you have to help others.",
            },
            {
                heading: 'Seeing a Need',
                text: "Being generous isn't just about giving stuff away; you have to know what to give, and to who. A hug will often help a friend that is upset, but if they are hungry, what they really need is something to eat. Just handing out gifts might seem generous, but if they aren't what people really need or want, it's more performative than helpful. Understanding what someone really needs, even if they're too embarrassed or shy to say, is a key part of the Spirit of Generosity.",
            },
        ],
    },
    {
        name: 'Spirit of Honesty',
        icon: '🍎',
        paragraphs: [
            {
                text: "Honesty is the element of harmony that most ponies will agree is important, think they mean it, but do the opposite when it matters. The truth can be hard to hear. And honestly, the more important it is for somepony to hear the truth, the harder it is to say. That's why ponies who embody Honesty tend to be the toughest Spirits of Harmony.",
            },
            {
                heading: 'The Truth Helps',
                text: "They say the truth hurts. It can. The truth can even be used to hurt on purpose, like when Diamond Tiara kept reminding the Cutie Mark Crusaders about their blank flanks. But even when a pony is honest for the sake of somepony else, it can still hurt, but that pain is more like tearing off a bandage. You can't leave the bandage on forever, and peeling it off slowly hurts too, it just hurts less for longer. Sometimes the best way to help a pony being lied to or lying to themselves is to tear that bandage off.",
            },
            {
                heading: 'Tough Lessons',
                text: "Sticking to the truth can be exhausting at first, but before long, you become stronger for it. Your feelings aren't as likely to be hurt by a pony telling you something honest, even if you're sensitive about it. And not lying when you assume somepony can't handle the truth teaches you that a lot of ponies do prefer honesty as much as they say they do.",
            },
        ],
    },
    {
        name: 'Spirit of Kindness',
        icon: '🦋',
        paragraphs: [
            {
                text: "A little kindness goes a long way, and it costs nothing to be kind. So why aren't more ponies kind? Because kindness takes trust. To be kind is to be vulnerable, and too many creatures think of vulnerability as weakness. The ponies who embody the Element of Kindness see it differently, living their lives showing how being vulnerable takes endurance. It's worth it in the end, they believe, because an Equestria with more kindness in it is a better world.",
            },
            {
                heading: 'Empathetic',
                text: "Kindness comes from understanding what other creatures are going through, and feeling how they feel. Once you see another creature's perspective on what they're going through, you understand what kind of support they need, and how to be kind to them.",
            },
            {
                heading: 'Taking Care',
                text: "You are there for other creatures, friends and non-friends. Some ponies might say \"friends or foes,\" but you like to think a foe is just a friend you haven't properly connected with. Others might call you naive for letting creatures that don't seem to care about you take advantage of you as you try to connect with them again and again, but the more they resist your kindness, the more you see them as a creature who hasn't experienced enough kindness to understand why you're being kind to them.",
            },
        ],
    },
    {
        name: 'Spirit of Laughter',
        icon: '🎈',
        paragraphs: [
            {
                text: "Laughter's the best! It's like your smile takes over your whole body. You can't move. Your belly shakes. You might even laugh until you cry. And you love it! Every second of it fills you with joy, and you literally couldn't be happier. And it's contagious. Have you ever laughed at how much somepony else is laughing? Or laughed at how much you're laughing? You're not even laughing at what you thought was funny anymore, you've moved on to laughing at how funny you thought it was!",
            },
            {
                heading: 'Spreading Cheer',
                text: "A good joke sticks with you. You could be lying in bed when you remember a good joke, and you chuckle yourself to sleep. Or maybe you're having a really grumpy day, when what's that coming to mind? Oh right, that good joke you heard. *gasp* Are you smiling? You know you are. You're pretending you're not, but I know a smile when I see one.",
            },
            {
                heading: 'Good for the Soul',
                text: "Laughter is not just an expression of something positive, it's a release of everything negative. A bad day is one comedy away from being not as bad. Two friends fighting are one funny moment away from forgetting why they were mad at each other. And strangers connect to each other when they share a laugh.",
            },
        ],
    },
    {
        name: 'Spirit of Loyalty',
        icon: '⚡',
        paragraphs: [
            {
                text: "Nothing means more to you than your friends. If they're unhappy, you are there to cheer them up. If they're in danger, you swoop in to rescue them. If somecreature hurt them, you're about to get all up in that creature's face. Your instincts can be reactionary, and sometimes your friends hold you back. There's nothing worse that upsetting a friend by helping them the wrong way. The element of Loyalty may have sparked inside of you, but you're still learning what embodying loyalty means.",
            },
            {
                heading: "Everypony's Best Friend",
                text: "Once you click with somepony, you really click with them, wanting to get to know them, try out their hobbies, and join them when they do their favorite activities. It's not rare for you to make that connection to someone either. As great as it is to have so many strong connections, there's only one of you. If two of your best friends are throwing a party on the same day, which one do you go to? Both! If ten of your best friends are racing, who do you cheer for? All of them!",
            },
            {
                heading: 'Enthusiastic',
                text: 'You aren\'t just loyal to your friends. You stage protests when your favorite series is canceled. You cry every time your favorite song plays. You would fly halfway across Equestria if you found out it was the only place that still served your favorite ice cream. Someponies describe your enthusiasm as "a lot" and suggest you "tone it down" because these things "shouldn\'t matter this much." And to think they were your best friend.',
            },
        ],
    },
    {
        name: 'Spirit of Magic',
        icon: '⭐',
        paragraphs: [
            {
                text: "The Elements of Harmony are the most powerful magic known to ponydom. Magic is both an Element of Harmony and the source of the bond between the other Elements of Harmony. It is also the most mysterious element. What is magic? In what ways does a pony who embodies magic also embody harmony? And what is magic's connection to friendship? Even Twilight Sparkle, the first Spirit of Magic, had more questions than answers. But that's OK. Spirits of Magic love questions.",
            },
            {
                heading: 'An Element Apart',
                text: "It's easy to see how being generous, honest, kind, loyal, and making people laugh creates friendships. Of course, you can make friends using magic, in the same way that you can make soup using magic. You have to figure out on your own what it is about magic you embody, and what friendship means to you.",
            },
            {
                heading: 'Great Responsibility',
                text: "Everypony has witnessed magic and knows that casting a spell can change everything. Not everypony understands that you might not have the right spell for every situation. You might not even be a spellcaster. Even if you are a spellcaster and your spells would help your friends, that's a lot of pressure. Spellcasting takes a lot of time and energy. As much as you might love to spend all day using your magic to help others with their issues, that doesn't leave you any time to deal with your own issues. Or just relax, and not think about any issues at all!",
            },
        ],
    },
];
