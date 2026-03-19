/** Influences from the MLP RPG Core Rulebook (pp. 44–67) */

export type InfluenceName =
    | 'Adventurer'
    | 'Animal Whisperer'
    | 'Artisan'
    | 'Bookworm'
    | 'Buckballer'
    | 'Business Savvy'
    | 'Chatty'
    | 'Crowdpleaser'
    | 'Futurist'
    | 'Heavy Hitter'
    | 'Intense'
    | 'Mentor'
    | 'Mountebank'
    | 'Nimble'
    | 'Party Maestro'
    | 'Powerhouse'
    | 'Precise'
    | 'Shrewd'
    | 'Sporty'
    | 'Spring into Action'
    | 'Stylish'
    | 'Tricky'
    | 'Vigilant'
    | 'Wheel Obsession';

export interface Influence {
    name: InfluenceName;
    description: string; // The introductory paragraph (NOT the example pony, NOT the suggested characteristics)
    influenceSkill: string; // e.g. 'Survival', 'Animal Handling' - the skill listed under "Influence Skill:"
    perkName: string; // e.g. 'Wild Tales'
    perkDescription: string; // The perk effect text
    hangUpName: string; // e.g. 'Wanderlust'
    hangUpDescription: string; // The hang-up effect text
    suggestedCharacteristics: string; // The "Suggested Characteristics" paragraph
    backgroundBonds: string[]; // Array of 12 bonds (index 0 = bond 1, etc.)
    /** For perks that require a choice (like Wheel Obsession's vehicle type), list the options */
    perkChoices?: string[];
}

export const INFLUENCES: Influence[] = [
    {
        name: 'Adventurer',
        description:
            'Your pony leads a life of adventure, packed full of action and sometimes danger. You live for the excitement of new discovery and the beauty of nature.',
        influenceSkill: 'Survival',
        perkName: 'Wild Tales',
        perkDescription:
            "You're passionate about exploring new places, environments, and cultures, and have a deep wealth of stories about your adventures to draw from. Once per scene, when you tell a short story about your experiences, you gain Edge on a Smarts or Social Skill Test.",
        hangUpName: 'Wanderlust',
        hangUpDescription:
            "Laying down roots isn't for you. If you roll the same non-conflict Skill Test in the same location more than once in a day, you suffer Snag every other time.",
        suggestedCharacteristics:
            'Adventurers are always looking for the next excursion, making friends with ponies they meet along the way.',
        backgroundBonds: [
            "I'm looking for unique artifacts of Equestria to gain a better understanding of the ponies who came before me.",
            "I don't need fancy stuff to get by – just show me to a nice clearing to camp for the night!",
            'I love meeting new ponies and finding common ground with those different from me.',
            'Cities and towns are fine and all, but nothing beats the great outdoors. The only thing better than heading out to the old woods is finding new woods to explore.',
            'I\'ve had a life-long "friendly" rival who, for years, has been searching for the same rare item as me. I often wonder who will find it first.',
            'My survival instinct and love of exploration inspires others to choose me as the leader during adventures outside of town.',
            "Because of my travels, I know ponies in every town around Equestria, even if I don't know how to immediately get in touch with them.",
            "When I see a pony or other creature in need of help, I will put everything aside to do so, even if it means derailing my own trip. After all, that's just a new adventure!",
            'It angers me when other ponies treat nature with disrespect. Pick up your litter!',
            "Sometimes I wander into places I know I shouldn't go, but I can't help my curiosity and constant desire to see what's just around the bend.",
            "I'll happily give somepony the small amounts of food I've managed to forage, but I'd rather teach them how to get some themselves so they know what to do when I'm not around.",
            "I'm content on my own, but I'd rather share my travels with friends.",
        ],
    },
    {
        name: 'Animal Whisperer',
        description:
            'You share a natural bond with animals that rivals your best friendships with other creatures.',
        influenceSkill: 'Animal Handling',
        perkName: 'Empathic Communication',
        perkDescription:
            'You speak to non-speaking animals as though you share a language and can communicate more complicated ideas with them when rolling Animal Handling Skill Tests.',
        hangUpName: 'Bad with People',
        hangUpDescription:
            'When communicating with non-animals you have only just met, you suffer a 1 penalty.',
        suggestedCharacteristics:
            'Consider why your pony has such a strong bond with animals, who or what your favorite animal is, and if you grew up with a pet or animal companion that was (or still is) a big part of your life.',
        backgroundBonds: [
            "There is nothing I wouldn't do to help an animal in need.",
            'Sometimes I feel that I have a closer bond with animals than I do other ponies.',
            'I was separated from an animal friend years ago, and I hope one day to find them again.',
            'Wild animals can sometimes seem scary, but they are really just misunderstood.',
            'Anypony who mistreats a helpless animal instantly becomes my enemy.',
            'I will always try to resolve a conflict with an animal with kindness and understanding instead of force.',
            'I like to watch how animals accomplish tasks, from building nests to storing food. Ponies can learn a lot from animals.',
            "The sound of a cat purring or a bird's tweet instantly puts a smile on my face, even when I'm in a sour mood.",
            'No animal is insignificant, even down to the tiniest ant.',
            'I sometimes wish I could escape everyday pony life and just live in the forest with my animal friends.',
            "I got in trouble swiping food from our kitchen to feed a hungry animal that lived outside my home, and I'm still convinced I did the right thing.",
            'I am drawn to animals that others usually are afraid of, such as snakes, spiders, and sharks. They need friends, too!',
        ],
    },
    {
        name: 'Artisan',
        description:
            'You were made to create. Whether you have the hooves of a crafter, the hips of a dancer, or the voice of a singer, you are most comfortable when practicing your art.',
        influenceSkill: 'Various',
        perkName: 'Express Yourself',
        perkDescription:
            'You are passionate about your art style, and gain Edge on Social and Smarts Skill Tests where your art style applies.',
        hangUpName: 'Artistic Blindness',
        hangUpDescription:
            "You sometimes get absorbed by your work and miss what's going on around you. You suffer Snag on Smarts and Social Skill Tests unrelated to your art while you are actively involved with your art.",
        suggestedCharacteristics:
            'Think about what type of artisan you are and how you apply that art to your everyday life. If you wish, roll a d12 for a random art form as your specialty from the table below, or use the list as inspiration to choose your own. You may take this Influence multiple times for different art styles. If you take the Hang-Up, it only applies to one of the styles you have taken each time to take it.',
        perkChoices: [
            'Acting',
            'Architecture',
            'Baking/Cooking',
            'Dancing',
            'Drawing',
            'Literature',
            'Music',
            'Painting',
            'Interior Decorating',
            'Poetry',
            'Sculpture',
            'Singing',
        ],
        backgroundBonds: [
            'I love to make my own gifts to give to friends and new ponies I meet.',
            'Sometimes I get jealous of other ponies when I think their art is better than mine.',
            'I use my power of wordsmithing to recite stories and speeches that inspire others.',
            "A piece of my art was auctioned off at an event by accident, and although the bits went to a good cause, I'm sad about not being able to keep it for my home.",
            "A mean-spirited pony once told me my art wasn't good enough, and now I'm self-conscious about my work.",
            "One of the highly respected citizens of Manehattan is a patron of my art, and I'm always working to make them their next piece.",
            "I believe art should exist for its own beauty, and it doesn't need to serve a purpose or send a message.",
            "I use tools given to me by a great artist, and one day I'll pass them down to a new aspiring artist.",
            'I pump all of my feelings, good or bad, into my art.',
            'It brings me great joy when my art makes people happy.',
            'I want ponies to look at my art on display and instantly recognize it as mine, so I try to be as unique as possible.',
            'My muse strikes at the most inopportune times – usually in the middle of the night or while I am performing other important tasks!',
        ],
    },
    {
        name: 'Bookworm',
        description:
            'You are happiest surrounded by books. The more books within reach, the better you feel.',
        influenceSkill: 'Culture or Science (pick one)',
        perkName: 'Bibliophile',
        perkDescription:
            'You know your way around a library. When researching a subject or searching for a book, whether looking for books on a certain topic, a specific title, or even based on an excerpt, you gain Edge on Skill Tests.',
        hangUpName: 'Lost In a Good Book',
        hangUpDescription:
            'Researching a subject or searching for a book takes you twice as long as expected, as you keep getting distracted by how much you love books.',
        suggestedCharacteristics:
            "There are so many types of books out there, and it's fun to think about what types of books your pony loves the most. Maybe your pony loves fantasy stories and embodies the heroics of their favorite character. Perhaps they prefer instructional non-fiction or research papers, and they always want to learn more. The type of books your pony likes to read can help you define many of their personality traits that make them unique!",
        perkChoices: ['Culture', 'Science'],
        backgroundBonds: [
            'One of my biggest life goals is to meet my favorite author.',
            "I've always wanted to write my own book, but I am scared other ponies may not love it as much as I love the books that I read.",
            'I own so many books that other ponies joke that I could start my own library. Maybe someday I will!',
            'My friend once told me about a secret library somewhere in Equestria, and it has always been a dream of mine to try to find it.',
            "One of my biggest peeves is when people mistreat books. Don't fold down the corners – use a bookmark!",
            "When I've recently read a new book, it's all I talk about for days on end.",
            'Knowledge is the key to everything, so I read everything I can, you never know what will be useful.',
            'I will always remember the teacher who taught me to read, and I want to teach others in the same way.',
            "I don't often admit it, but I look down on ponies who don't like to read.",
            "I often fail to pay attention to the tasks at hand because I'm secretly reading a book under the table instead.",
            'My favorite rare book was damaged long ago, and I hope to someday find another copy.',
            "Forget dogs – a book is a pony's best friend!",
        ],
    },
    {
        name: 'Buckballer',
        description:
            "Buckball is a popular game a little like Basketball with a particular position for each pony type. Each team is made of three players, one of each pony type. The Earth ponies challenge each other to control the ball. They try to kick into a basket being levitated by their Unicorn teammate on the other side of the field to gain points. Meanwhile the Pegasi on each team fly around trying to interfere with the opposing team's ball and stop them gaining points. It involves a lot of bucking (kicking), so whether by playing buckball, or through other experience, you've mastered kicking objects where you want them to go.",
        influenceSkill: 'Targeting',
        perkName: 'On Target',
        perkDescription:
            'Once per round, you can spend a free action to use Targeting to perform a simple task from a distance of up to 60 feet. For example, if you need to place a basket of apples on a cart, you can buck the basket with a Targeting Skill Test as a Free action.',
        hangUpName: 'Longshot',
        hangUpDescription:
            'When you Fumble a Targeting Skill Test to kick an object, the object you kicked takes 1 Blunt Damage because you struck it so hard.',
        suggestedCharacteristics:
            'Your history as a buckballer makes you great at kicking, sure, but it has also enforced a drive to always take aim for what you want to accomplish, both literally and figuratively.',
        backgroundBonds: [
            'I make a game out of everything, including housework!',
            "When I miss a shot, I'm extremely hard on myself.",
            "I'll stop whatever I'm doing to hit a target with a random object.",
            "My older sibling taught me the proper way to take aim, and I'll always remember that.",
            'When speaking to others, I always use buckballing terms such as "hitting a target" or "aiming to succeed."',
            'I prefer to stand back and take a ranged approach vs. getting into the thick of a situation.',
            'I like to show off and do fancy tricks with my bucking, even in serious situations.',
            'I injured a family member once by not looking before I bucked, and now I always take the time to aim and be sure of my target.',
            'I made up my own game that requires bucking apples into pails set up in different configurations, and I try to teach it to everyone I meet.',
            "Sometimes I'll miss on purpose to make my fellow ponies feel less intimidated by my skills.",
            'I blame my misses on other ponies, distractions, or whatever I can to distract from my embarrassment.',
            "I'll use my bucking ability over any other way to take care of a situation.",
        ],
    },
    {
        name: 'Business Savvy',
        description:
            'Business is your life, and life is good. You have an eye for opportunity – usually bits-making opportunities – and the follow-through to make them happen.',
        influenceSkill: 'Various',
        perkName: 'Career',
        perkDescription:
            'Choose a profession. It could be personal (like a shop owner or farmer) or part of a larger company (like a corporate president or talent agent). Then, choose an appropriate Skill related to that profession, such as Culture, Persuasion, Technology, or Streetwise. If a Skill Test applies to your career, you can substitute the required Skill with your chosen career-appropriate Skill.',
        hangUpName: 'Spend Money to Make Money',
        hangUpDescription:
            'You suffer Snag on Wealth checks as your resources are tied up in your business.',
        suggestedCharacteristics:
            "Being savvy in business can lend itself to other personality traits and quirks. For some ponies, the goal of success and wealth is a priority, and even if they aren't greedy, that desire creeps into the decisions they make. For other ponies, the knowledge of how a great business is run helps them see how good teams are formed, giving them insight into problem-solving and finding the right task for the right pony. Think about how your career has impacted how you act outside your job.",
        perkChoices: ['Culture', 'Persuasion', 'Technology', 'Streetwise'],
        backgroundBonds: [
            'The secret to success is hard work and preparation.',
            "I love to invest in and help with my friends' endeavors.",
            'My dream is to open franchised locations of my business all over Equestria.',
            'I feel most empowered when I can make the decisions for my team.',
            'Solving problems in a business takes teamwork and communication, and the same can be said about problems outside of business as well.',
            'I celebrate the ideas of my employees and co-workers, often with cake!',
            "My business is a dream I've had since I was a foal, and I take great pride in it.",
            'Keeping my business running and profitable is of high priority to me.',
            'I donate 25% of the bits I make with my business to local charities.',
            'I take pride in being the best in my line of work.',
            'Sometimes I let work take too much time from my friends and family.',
            "I get grumpy when others don't appreciate how much hard work I put into any job, both in and outside my career.",
        ],
    },
    {
        name: 'Chatty',
        description: 'Never at a loss for words, you have a lot to say about a lot of topics.',
        influenceSkill: 'Persuasion',
        perkName: 'Chatter Flashback',
        perkDescription:
            'You remember something interesting someone said once. Three times per day, you can substitute a Smarts Skill with Persuasion for a Skill Test.',
        hangUpName: 'Chatterbox',
        hangUpDescription:
            'You suffer Snag on Infiltration Skill Tests that involve stealth as you can never quite stay quiet enough, even talking to yourself if no one is around.',
        suggestedCharacteristics:
            "You love sharing your gift of gab with anyone who cares to listen. Do you enjoy gossiping about other ponies? Or do you just enjoy making new friends and having long conversations? For some ponies, talking a lot is a nervous habit, while for others, it just is a way to share the things they're interested in with others. Think about the motivations for why your pony character is particularly chatty and how that comes into play in daily activities!",
        backgroundBonds: [
            'I have a hard time keeping secrets.',
            "I'm often afraid that people judge me for talking too much.",
            'I love gossip – the juicier the better! I always want somepony to spill the tea with me!',
            'I find myself constantly jumping from one topic to another.',
            "A great story told by a friend is better than any book or production you'll see at Ponyville Theater!",
            'Sometimes I feel that there are too many things to say and too little time to say it without leaving out something important!',
            "I often interrupt others, usually realizing I've done so way too late.",
            "Just because I'm a talker, doesn't mean I'm not a good listener. And I am great at remembering details about conversations I've had.",
            'I once talked my way out of a very scary situation.',
            "My friends know that if they ever need somepony to talk to, I'm always here for them.",
            "I get impatient with ponies who don't seem to pay attention to what I'm talking about.",
            'My nickname in school was "Fillybuster," because I never let my teachers get through a sentence without interrupting with additional facts on the topic.',
        ],
    },
    {
        name: 'Crowdpleaser',
        description:
            'A natural performer, you tap into a creative well deep inside you and share it with others.',
        influenceSkill: 'Performance',
        perkName: 'Wow the Audience',
        perkDescription:
            'You gain ↑1 on Performance Skill Tests if 10 or more creatures are present and observing you. You gain an additional ↑1 if 100 or more creatures are present and observing you, and another ↑1 if 1000 or more creatures are present and observing you.',
        hangUpName: 'Out of Touch',
        hangUpDescription:
            'You filter reality through the lens of your art, obscuring your perception of the way things actually work. You suffer Snag on your first non-Performance Skill Test of each day.',
        suggestedCharacteristics:
            "A Crowdpleaser can be anypony who enjoys being in front of an audience. Are you a member of a dance troupe or a choir? Maybe you aren't in entertainment but instead give educational lectures or are on political or press tours, where giving speeches in front of large crowds is common. Thinking about how the cheers of an audience motivate your character will help integrate their love for their performance abilities into their decisions and actions.",
        backgroundBonds: [
            'I am too impulsive when trying to show off or impress others.',
            'Positive affirmation and feedback from others makes me feel like I can accomplish anything.',
            "I'm always performing in some way when around others, I'm not comfortable being myself unless I'm alone.",
            "I suffer from imposter syndrome and sometimes wonder why people think I'm good at what I do.",
            'I was very unpopular growing up, so I use my newfound stardom to include others who are often ignored.',
            'If I did something awesome and nopony was around to see it, did I make a sound?',
            "I often need to be the center of attention, even when it isn't my place or turn.",
            "I can be on stage all day long, but I'm very shy in one-on-one conversations.",
            'I once met a celebrity who gave me some great advice. My goal is to perform on stage with them someday!',
            'I secretly have major stage fright, but I always fight through it and have never let anypony but my closest friends know.',
            "While I love to perform, when I'm not performing in my main medium, I feel uncomfortable and like I'm not good enough.",
            "I'm looking to get my big break to become a superstar!",
        ],
    },
    {
        name: 'Futurist',
        description:
            'Carts and books are all fine and good, but you know that the carts of tomorrow drive themselves, and the books of tomorrow read themselves.',
        influenceSkill: 'Technology',
        perkName: 'Reverse Engineer',
        perkDescription:
            'Three times per day, when you need to roll a Skill Test outside of a conflict, you can take twice the time and substitute the Skill Test for Technology instead.',
        hangUpName: 'Laypony Terms',
        hangUpDescription:
            'Other ponies find you hard to understand. When you use Technology instead of a Social Essence Skill, you suffer Snag.',
        suggestedCharacteristics:
            "As different cities around Equestria grow and change with new technology, you find yourself at the forefront of it all. Whether you just enjoy new gadgets and gear, have a deeper understanding of how things work, or are an inventor or engineer yourself, being a part of what's new and progressive in technology permeates your everyday life.",
        backgroundBonds: [
            'I have a habit of looking at an object and getting lost in ideas of how to improve it using the latest scientific and technological findings.',
            "While I love the idea of machines helping us accomplish our daily tasks in a more efficient manner, I still believe we can't rely on them to do our thinking for us.",
            "My speech is loaded with jargon that many other ponies don't understand.",
            'It is important to look to past mistakes in order to better prepare for future challenges.',
            'I worry about the future and how ponies with less-than-generous motivations will use technology for their own greed.',
            'I use my futurist ideas to help think of ways to maintain a sustainable future for all of Equestria, without the need to worry about the quality of our food, water, or resources.',
            'My ability to make future projections allows me to help my friends be ready for the unexpected, determine strategic actions, and build long-range plans of action, when needed.',
            'Whatever happens today, good or bad, will be ok. There is always a tomorrow.',
            'I tend to flip-flop between being optimistic about a future utopia, highlighting ways to perfect society, and an anxious doomsday prophet, pointing out what could go wrong.',
            'I get upset when I think about any creature who would damage our natural resources or pollute Equestria, as I see that abuse leading to detrimental environmental consequences in the future.',
            "I don't care about the academic side of futurism; I just want to wear the trendiest clothes, listen to the coolest music, and eat the now-est food.",
            "When I'm working on a new idea, philosophy, or gadget, I sometimes don't leave my home for days. Some ponies have called me a hermit, but I just get into a \"zone\" that I can't shut off.",
        ],
    },
    {
        name: 'Heavy Hitter',
        description:
            'If power is to put something in its place, everypony knows who to call. You. They call you.',
        influenceSkill: 'Might',
        perkName: 'Force',
        perkDescription:
            'If you make a successful unarmed attack using Might, you may do an additional point of Health damage. But using this ability is exhausting so you may only use it once per scene.',
        hangUpName: 'Fleeting Energy',
        hangUpDescription:
            "When you push yourself to your limit, you need a break to recover. After you use the Heavy Hitter Influence's Force Perk, you suffer ↓1 on Strength based Skill Tests until the end of your next turn.",
        suggestedCharacteristics:
            'Some Heavy Hitters punch first and ask questions later. Some take careful consideration of their own might and think things through before using it. Anypony as strong as you are knows that there is a great responsibility that comes with being so strong, but used at the correct time, that strength can help others and even save lives! Consider how your strength is both a help and a hindrance in your life and how it affects your actions.',
        backgroundBonds: [
            'Sometimes I have the impulse to use my hooves to get past a problem, when I really should be using my brain.',
            'Training and building my muscles is an important priority for me, and the endorphin rush gets me pumped up for action!',
            "Despite my ability to do so, fighting is always a last resort when I'm trying to solve a conflict.",
            'Sometimes I forget my own strength and am too rough with others.',
            "Hoof wrestling is one of my favorite pastimes, and I often challenge others to a match to solve disagreements. Who gets to decide what's for dinner? Let's hoof wrestle for it!",
            "My strong frame may look intimidating, but on the inside, I'm friendly, helpful, and kind.",
            "I've acted as a personal bodyguard to a few celebrities in Equestria.",
            'When I was younger and not as even-tempered, I got in trouble at school for hoof fighting.',
            "I broke my friend's favorite household object by accident due to my overexertion of strength, and I vow to find them a replacement.",
            "Sometimes I feel guilty or anxious if I haven't exercised that day.",
            "For years, everypony has been telling me I should become a buckballer, since my kicks are so strong, but I'm just not that interested in sports.",
            "I once kicked somepony in the face by accident, and they lost a permanent tooth. I'll never forgive myself for not paying attention to my surroundings.",
        ],
    },
    {
        name: 'Intense',
        description:
            "Whether it's something you intentionally call upon, or just your natural state, everypony is worried about crossing you. And like it or not, this works to your advantage.",
        influenceSkill: 'Intimidation',
        perkName: 'Focus',
        perkDescription:
            'You can dedicate your mind to a single task and let nothing disturb you. You may add +2 to your Willpower against an attempt to stop you performing an action or stopping your plans.',
        hangUpName: 'Jarring',
        hangUpDescription:
            "Your natural scowl leaves a bad first impression. You suffer Snag on Deception and Persuasion Skill Tests on anypony you haven't met before the current scene.",
        suggestedCharacteristics:
            'Your intensity can come across in different ways, from intellectually intimidating to downright threatening. Think about how you want your pony to be viewed by others.',
        backgroundBonds: [
            'I often feel like nobody understands me.',
            'My physical appearance gives an impression that is different than who I am inside.',
            "I have trouble explaining how I really feel, and everything I say comes out as if I'm angry.",
            "Other ponies think I'm arrogant, but I'm really just trying to be helpful with my knowledge.",
            'I enjoy when other creatures are intimidated by me.',
            'I use my intensity to manipulate situations to my advantage.',
            'I grew up alone for the most part, so I tend to push people away until I learn to trust them.',
            'I express my intensity through the music I listen to.',
            'I enjoy engaging in physical activity to relieve my stress.',
            'A fun day with friends helps to subdue my intense feelings.',
            'When I get frustrated, my intense nature expresses that frustration as anger.',
            'I meditate each morning to help feel less intense and intimidating.',
        ],
    },
    {
        name: 'Mentor',
        description:
            'You love bringing out the best in others, and helping them understand what normally confuses and frustrates them.',
        influenceSkill: 'Culture',
        perkName: 'Those Who Know, Teach',
        perkDescription:
            'Three times per day, when you Lend Assistance, the creature you assist gains the benefits of your help for the rest of the scene/encounter instead of 1 Skill Test.',
        hangUpName: 'Misled',
        hangUpDescription:
            'When you Lend Assistance to a creature and they fail at the Skill Test, they suffer ↓1 on their next Skill Test.',
        suggestedCharacteristics:
            'You have learned patience and understanding by dealing with the repetitive nature of teaching and mentoring others. Mentors often take pride in their students or mentees, as well as their own understanding of the knowledge they impart to them.',
        backgroundBonds: [
            "Mentoring others about the things I'm passionate about is truly fulfilling.",
            'I have trouble saying no when ponies ask me for help.',
            "Some ponies think I'm bossy, but I am just trying to help them do things the right way.",
            'I value being a confident mentor to others.',
            'I often give unsolicited advice.',
            "I will always take the time to teach others anything I've learned that they also want to know.",
            'The best mentor creates students that surpass them in skill.',
            'Only those who are well-educated have the ability to make an informed choice.',
            'I am secretly jealous of one of my mentees.',
            "I feel resentful when a mentee doesn't appreciate my time.",
            'While I have knowledge in certain areas, I still feel like I have a lot to learn.',
            'I feel better when teaching a group of friends than hoarding knowledge to myself.',
        ],
    },
    {
        name: 'Mountebank',
        description:
            'Your life experiences taught you that not everypony can be trusted, a lesson you now teach others. It\'s not a lie if you wrap it up with enough razzle dazzle that everypony wants to believe. OK, it is still a lie, but I bet you wanted to believe it because "razzle dazzle" is fun to say.',
        influenceSkill: 'Deception',
        perkName: 'Fresh Marks',
        perkDescription:
            'You gain Edge on Deception Skill Tests the first time you target a specific creature.',
        hangUpName: 'Fool Me Twice',
        hangUpDescription:
            'You suffer ↓1 on Deception Skill Tests that target a creature you already targeted with a Deception Skill Test.',
        suggestedCharacteristics:
            "A life of trickery and deception can get to a pony's psyche. Does your pony feel bad about their deceptive actions? Or do they feel like what they do is fair in the name of getting ahead?",
        backgroundBonds: [
            "I'm slippery with the truth, except when speaking with my best friends and family.",
            "I'll do what I have to in order to be successful.",
            "I was tricked out of my family fortune, and now I'll use those same tricks to get it back.",
            'I love to gamble and will make impulsive bets, relying on my sleight of hoof to cheat my way into a win.',
            "Who can say that Snake Oil doesn't really work?",
            'When caught in a lie, my first instinct is to run away.',
            'I once put the blame on my best friend, and I will never forgive myself.',
            'I was forced into a life of hardship at a young age.',
            'I like to "game the system" to get what I want.',
            'I can talk my way out of almost any sticky situation.',
            'I once sold a product under false pretenses that made another pony sick. After that, I draw the line at selling counterfeit goods.',
            "My biggest enemy forgave me for tricking them, and I've learned the value of forgiveness.",
        ],
    },
    {
        name: 'Nimble',
        description:
            'Whether on land, through the air, or in water, your impressive agility lets you move about any way you want.',
        influenceSkill: 'Acrobatics',
        perkName: 'Acrobatic Reaction',
        perkDescription:
            "Once per day, when an effect successfully targets your Evasion, you can immediately make an Acrobatics Skill Test against a DIF set by the results of the effect's Skill Test. If you succeed, the effect fails. For example, if a snare trap successfully hooks your hoof, you can use Acrobatic Reaction to see if your natural nimbleness saved you at the last second.",
        hangUpName: 'Acrobatic Outlook',
        hangUpDescription:
            "You don't see as many obstacles in your path as others and have trouble remembering not everycreature sees the world the same way. You cannot Lend Assistance on Speed based Skill Tests.",
        suggestedCharacteristics:
            'Nimble ponies take their training seriously to remain so. Without daily exercise, the agility and flexibility you exhibit in your acrobatics can go away. Your pony may include exercise as a focus of their day or just get it out of the way each morning.',
        backgroundBonds: [
            'I am so flexible that I can move my body like a contortionist, which freaks some ponies out.',
            'Some day, I want to compete in gymnastics in the Equestria Games.',
            "I'm very athletic but I don't like to show off my skills, competition and athletic displays just seem a bit silly to me.",
            'My family comes from a long line of circus performers.',
            'Why walk when you can cartwheel?',
            'Acrobatics seems like a solo talent, but so much relies on a good partner who understands balance.',
            "I'll bend over backwards for a friend. Get it?",
            'I broke my leg while trying an acrobatic trick, and every once in a while, it acts up on me.',
            "I'm quick to tumble both into and out of trouble.",
            'I want to take my talents to Las Pegasus and join one of the shows.',
            "I know I've tried my hardest when my muscles ache.",
            'I always strive to put my skills to the best use for my whole team.',
        ],
    },
    {
        name: 'Party Maestro',
        description:
            'You can start a party, anywhere, anytime, and with anyone. Usually it lifts the spirits of your group and improves morale to no end, but you have a tendency to get overexcited and it can start to get very wearing.',
        influenceSkill: 'Persuasion',
        perkName: 'Party Power',
        perkDescription:
            'You have an almost magical ability to get a party started with a loud and exciting signature move. It may be firing a confetti cannon from nowhere, conjuring a few crates of bubbly fizzy drink, spontaneously covering an area in decorations or even getting everyone in the area dancing. You can use this ability three times a day, and when you do, not only does the party begin, but the group gains a Friendship Point.',
        hangUpName: 'Fun Exhaustion',
        hangUpDescription:
            'Too much noise and excitement can get very wearing. Once you have used your Party Power Perk once in the day, any subsequent uses annoy everyone. You still gain the Friendship Point, but you cannot assist or be assisted by anyone else for the rest of the scene/encounter.',
        suggestedCharacteristics:
            "Party characters are social characters! However, all that effervescence can become grating if they don't know when to take it down a notch. It is important to note they can only start a party, not force it on anyone. People might start dancing, but they can stop as soon as they like.",
        backgroundBonds: [
            'I just want everyone to have fun!',
            "Life is better when it's loud.",
            'I love a party but no one else seems to want them.',
            'I wish someone would throw a party for me one day.',
            'The best thing about parties is meeting new people.',
            "It's not a party without games and challenges.",
            'A party can happen at any time, so I must always be ready.',
            "It's not a real party unless all my friends are there.",
            'A party is a great way to avoid thinking about things that upset you.',
            'I like to make every party memorable in some way.',
            "Everyone loves a good party (even when they say they don't…)",
            'No one throws a better party than me!',
        ],
    },
    {
        name: 'Powerhouse',
        description:
            'Everything you do, you do it full strength. Who needs a cart when you carry your groceries? Who needs to be fast when you can power through? While a Heavy Hitter knows how to focus their Strength in combat, you know how to use your strength when it comes to lifting and carrying and using the raw power of your physique.',
        influenceSkill: 'Brawn',
        perkName: 'Muscle Over Panache',
        perkDescription:
            'Three times per day, you can use Brawn in place of a Speed skill on a Skill Test.',
        hangUpName: "Don't Know Your Own Strength",
        hangUpDescription:
            "You are super strong, even when you don't want to be. You suffer ↓1 on Speed skills when you try to do something delicate.",
        suggestedCharacteristics:
            "Whether you are a muscle-bound pony who works out all the time or just have innate strength from within, your reputation for being a Powerhouse precedes you. From something as simple as a pony needing a jar to be opened to lifting or hauling huge loads of cargo, you're the first pony that everypony thinks of to get the job done. This is both good and bad, and it's helpful to consider how being physically strong affects you and your personality.",
        backgroundBonds: [
            'Sometimes I feel bad that ponies only look to me when they need me to help them with my strength and not my good ideas.',
            'I like to use my brawn to build houses and other large projects as a creative outlet.',
            "I'm eager to help other ponies who are not as big and strong as I am, just as I'm glad when they help me with things I'm not as good at doing. That's what friendship is all about!",
            "I come from a long line of haulers and lifters, and it's a family tradition to continue that type of work.",
            'My size and strength cause me to be hungry all the time!',
            'I prefer to walk than to take a carriage or train to my destination.',
            "I enjoy putting in a hard day's work of heavy labor, and it makes me feel accomplished that my own hooves can get things done.",
            "I was the smallest in my family when I was young, and my siblings made fun of me for it. Even though I'm big and strong now, I can't forget how they teased me.",
            'I will use my physical form to block or protect an innocent creature from danger. I can take it.',
            'I often think about how I wish I was as strong on the inside as I am on the outside.',
            "If I had a bit for everypony who has told me that they owe me a favor for helping them with my strength, well…I'd have a lot of bits!",
            'I won a weightlifting trophy at the Iron Pony competition a few years ago, and nopony has broken my record yet!',
        ],
    },
    {
        name: 'Precise',
        description:
            'You are in touch with the details of the world, better skilled at threading a needle than hauling a box of dresses.',
        influenceSkill: 'Finesse',
        perkName: 'Detail Oriented',
        perkDescription:
            'When you make a Finesse Skill Test you may choose to use either a Move or a Standard Action for the Test. You may use this Perk three times/day.',
        hangUpName: 'Sensitive',
        hangUpDescription:
            "You're more aware than most of the strain on your hooves. When you take Damage, you also suffer Snag on Skill Tests for the next round. You can expend one of your daily uses of Detail Oriented to ignore this effect for one round.",
        suggestedCharacteristics:
            'Precise ponies have tendencies of also being perfectionists. Others may be fearful of doing something wrong. Consider how your preciseness reflects in your actions and personality.',
        backgroundBonds: [
            'Conformity is important to me.',
            "If I don't do something perfectly right, I try again and again until I do.",
            'I never feel like I am good enough at what I do.',
            'I love when everything works out as I planned.',
            'Messy environments give me anxiety.',
            'My parent always said I should be a surgeon, since I have such a steady hoof.',
            'I enjoy crafts that require fine details.',
            'Other ponies look to me when they need help hanging pictures straight and the like.',
            'I have excellent penmanship.',
            'I pamper my hooves whenever possible, since I rely on them for my excellent fine motor skills.',
            '"Good from far, but far from good" is a phrase I will never agree with.',
            'I love to learn new skills that showcase my talent with precision.',
        ],
    },
    {
        name: 'Shrewd',
        description:
            "You've lived a life of hard knocks and learned from your past experiences. While you may not be short on formal education, you have gained a knack for deciphering others' intentions and figuring out problems from lessons learned on the street. Sometimes that means using whatever tools you have to get by, even if you have to cheat the system to do so.",
        influenceSkill: 'Streetwise',
        perkName: 'Street Smarts',
        perkDescription:
            'Once per day, when performing a Skill Test you can try to cheat or make the Test in an underhanded way. You should describe how this deceitful action helps your Skill Test to the GM. If the GM agrees the subterfuge will help, you may use Edge on the Test. But if the Test fails your duplicity is revealed and you may not gain a Friendship point for the rest of the scene.',
        hangUpName: 'Betrayal',
        hangUpDescription:
            'If you Lend Assistance to a creature and they fail their Skill Test, you are no longer considered an ally for the purpose of using Perks and other abilities with the rest of the PCs. This lasts for the rest of the scene/encounter, or until one of the other PCs spends a Friendship Point to heal the breach of trust.',
        suggestedCharacteristics:
            "Your ability to read situations and judge others' actions is superior to most, based on your many experiences. As a result of those experiences, you have many stories to tell.",
        backgroundBonds: [
            'I\'m an excellent judge of character, but it is difficult for others to "read" me.',
            "While I'm usually great at making decisions, if I can't quite choose, I'll flip a coin.",
            'I always trust my gut.',
            'I take a long time to analyze a situation and determine what action to take.',
            'Others turn to me for advice, and I enjoy giving it to them.',
            'My mentor taught me that one wrong choice can impact many lives, so I strive to always think how my actions will affect others.',
            "I get frustrated with ponies who can't make a decision.",
            "I'm shrewd as a serpent, innocent as a dove.",
            'I pride myself on being able to assess a situation quickly and to use this understanding to my advantage.',
            "I'm shrewd in business but a sucker when it comes to my friends.",
            'I have a tactical mind for negotiation and strategy.',
            "I'm not above using deceit or deviousness to get my own way.",
        ],
    },
    {
        name: 'Sporty',
        description:
            "You love athletic competition. Whether it's on your own, like in a race or at the bowling alley, or a team sport like buckball or horse hockey, you are at your best proving what you can do.",
        influenceSkill: 'Athletics',
        perkName: 'Shoots and Scores',
        perkDescription:
            'When you achieve Critical Success at an Athletics Skill Test, you gain a Friendship point.',
        hangUpName: 'Competitive',
        hangUpDescription:
            'When you and an ally roll the same Skill Test, if your ally gets a higher result than you, you have Snag on your next Skill Test this scene.',
        suggestedCharacteristics:
            'Think about how being sporty has affected your personality. Do you have an overwhelming drive to win? Do you spend your days partaking in any type of physical activity that you can? Is buckball or another sport your main source of social interaction and friendship with other ponies? These aspects of being part of a team sport can be reflected in how your pony reacts to the world around them.',
        backgroundBonds: [
            'Talent wins games, but teamwork wins championships.',
            "I'm harder on myself when I make a mistake than I am on my teammates.",
            'My competitive nature sometimes irks other ponies.',
            'I often prioritize buckball ahead of other important parts of my life.',
            'My former coach instilled a drive for perfection in me that sometimes seems impossible to obtain.',
            "I don't care who wins the game, as long as everypony is having fun.",
            "I'm always the first pony to suggest an after-practice hangout, with snacks!",
            'I broke my leg playing buckball when I was just a foal, and it never quite healed right.',
            'I was caught cheating in a buckball game once, and the pony who saw it has never spoken up about it.',
            'I will make a game out of any minimal task, whether it is throwing away a piece of trash or cooking a meal.',
            'Practice makes perfect, in buckball and everything else.',
            "I know I'm good at sports, but sometimes I wish ponies would appreciate me for my other talents.",
        ],
    },
    {
        name: 'Spring into Action',
        description:
            "When adventure's ahead, you dive in hooves first! Where an adventurer takes their time to investigate, you prefer to act before anything has a chance to stop you.",
        influenceSkill: 'Initiative',
        perkName: 'Springy',
        perkDescription:
            'When you roll your first Initiative Skill Test in a Conflict, you can do so as if you have a specialty in Initiative.',
        hangUpName: 'Ambush Prone',
        hangUpDescription:
            "Enemy creatures targeting you when you're surprised get Edge on attacks.",
        suggestedCharacteristics:
            "A pony who is always ready to spring into action can be quite impulsive in other ways too. Perhaps you make quick decisions without thinking. Maybe your words tumble from your mouth faster than you can think through what you are saying. Incorporating your fast-acting nature into your pony's behavior will add a layer of quirk to this otherwise powerful trait.",
        backgroundBonds: [
            'I tend to run into action before a plan is fully formed.',
            'I use my initiative to determine the course of action by my entire party.',
            'I often speak before I think.',
            "Even though I'm quicker than others, I'll always ask their opinion on what I should do before acting.",
            "My mentor taught me that when you take initiative, you're responsible for modeling proper actions to others.",
            'I get upset when I decide on a plan, and another pony does something to contradict it.',
            'Even though I move quickly, I speak very slowly.',
            "I'll never turn down a challenge to a race of any kind.",
            'I once acted too impulsively and have a permanent scar as a reminder.',
            "I beat my training partner in a race at the Equestria Games for the gold, and now they don't talk to me anymore.",
            'The early bird gets the worm.',
            'I never look before I leap.',
        ],
    },
    {
        name: 'Stylish',
        description:
            'Whether you know much about fashion and trends or not, you have a knack for looking good. Clothes just seem to hang on you better than anyone else, and you know what colors work best for you in everything. You also have an uncanny knack of wearing the right thing for the right occasion.',
        influenceSkill: 'Performance',
        perkName: 'Natural Style',
        perkDescription:
            "People can't help but be impressed with your style. When meeting anycreature for the first time you gain ↑1 on any Social Essence Skill Test you make involving them for that scene.",
        hangUpName: 'Celebrity Overdrive',
        hangUpDescription:
            'Looking this good tends to get you a lot of attention. At any social event, someone will always notice if you are about to leave and anything embarrassing you do will undoubtedly be noticed and commented on. You suffer ↓1 to Stealth Skill Tests in social situations.',
        suggestedCharacteristics:
            "While looking good can be a big help at social occasions, it doesn't make it easy to blend in. Stealth is just not your forte, as in truth, you want people to see you, even people you don't like. Keeping up with fashion or trying to figure out new outfits can be time consuming though, and expensive. But people sometimes come to you for advice and you like helping people find their own style.",
        backgroundBonds: [
            'Fashion is for everyone.',
            "I don't have time for people who don't take time to look good.",
            'Everyone can look beautiful.',
            "If I'm not well dressed, I don't leave the house.",
            'I love to discover new styles and clothing traditions.',
            'Good fashion is all about the accessories.',
            'There is no such thing as too much fashion!',
            "I lead fashion, I don't follow it.",
            "My style doesn't follow fashion; it is as timeless as I am.",
            'Dark and mysterious colors are best.',
            'Bright and exciting colors are best.',
            'I can make anything look good.',
        ],
    },
    {
        name: 'Tricky',
        description:
            'Tricks are as much about spry hooves as they are about convincing onlookers where to look.',
        influenceSkill: 'Infiltration',
        perkName: 'Bait and Switch',
        perkDescription:
            'You may spend a Friendship Point to get your allies to help you distract and confuse onlookers. If you do, you gain Edge on any Deception or Infiltration Skill Tests you make until your next turn.',
        hangUpName: 'Outfoxed',
        hangUpDescription:
            'When you fail an Infiltration Skill Test against another creature, that creature gains Edge on Skill Tests against you for the next round.',
        suggestedCharacteristics:
            'Being tricky can mean various things, but in the sense of infiltration, your pony is adept at blending in and making ponies see what you want them to see. How that affects your friendships and other relationships depends on how much you let on to the people you trust.',
        backgroundBonds: [
            'I enjoy putting on disguises and pretending to be somepony else.',
            'Diversions are just as important as stealth.',
            "I like to speak in different accents to hide my identity, even if I'm not the best at it.",
            "Even my closest friends don't know my real name.",
            'I was once a member of a secret spy organization.',
            'My biggest fear is slipping up when I\'m supposed to be "somepony else."',
            "I think I'm a lot sneakier than I really am.",
            'My tricky nature has made me paranoid of others, and I always question the motives of strangers.',
            'When one hoof is doing something in the open, the other is always hiding something.',
            "Even though I'm good at it, it makes me feel bad to lie to anyone, even with good intentions.",
            'I sometimes get so caught up in my own deceptions that I forget what the real truth is.',
            "I will never deceive anyone who isn't evil.",
        ],
    },
    {
        name: 'Vigilant',
        description:
            'You remain ever aware of your situation, always watching, taking in your surroundings.',
        influenceSkill: 'Alertness',
        perkName: 'Take in a Scene',
        perkDescription:
            'When you roll for Initiative, also roll an Alertness Skill Test to notice any creatures trying to Surprise you. If you succeed, you are not Surprised.',
        hangUpName: 'Misplaced Confidence',
        hangUpDescription:
            'When you Take in a Scene, if your Alertness Skill Test fails, you are Surprised for two rounds instead of one.',
        suggestedCharacteristics:
            'Staying vigilant is important, especially when on a scary adventure, but how does always being on the lookout affect your pony? Perhaps they check the windows every so often, or maybe they have a need to set up security protocols wherever they go. The level of vigilance your pony adopts will affect how they act around others.',
        backgroundBonds: [
            'Trust nopony.',
            'When out on an adventure, someone needs to keep watch at all times.',
            'I hate surprises.',
            "I get little sleep because I'm always worried something bad might happen.",
            "I like to keep a record of the things that happen in my neighborhood, looking for patterns in other ponies' behaviors.",
            'Staying alert to my surroundings is the key to subverting danger.',
            "I'm extremely detail oriented and can recall the previous day's events perfectly.",
            'I always look twice at anything, just in case I miss something the first time.',
            "I'm always on the lookout for trouble that may be coming our way.",
            "I falsely accused a foal of a wrongdoing that landed them in trouble, and ever since, I'm very careful to get my facts straight.",
            'If assigned to be a lookout, I will remain at my post at all times until I am released from my duty.',
            'Being alert means relying on more than just your eyes.',
        ],
    },
    {
        name: 'Wheel Obsession',
        description:
            'Whether you conduct a train, fly hot air balloons, or draw one of those newfangled carriages seen on the streets of Manehattan, you love operating a vehicle.',
        influenceSkill: 'Driving',
        perkName: 'Wheel Excited',
        perkDescription:
            'You gain Edge on Skill Tests related to one type of vehicle (Land, Sea, or Air, which you pick when you gain this Perk). This might be an Acrobatics Skill Test to embark on a moving vehicle, a Technology Skill Test to fix a broken vehicle, and, of course, Driving tests to drive vehicles.',
        hangUpName: 'Wheel Struggle',
        hangUpDescription:
            'When you are in a vehicle and you are not the driver, you suffer Snag on all Skill Tests.',
        suggestedCharacteristics:
            'You are obsessed with vehicles, whether you own one or not. What is your favorite kind? Do you talk about them all the time? Have you given a name to one that you do own? These pieces of information give characteristics to your pony and show others how deep your obsession runs.',
        perkChoices: ['Land', 'Sea', 'Air'],
        backgroundBonds: [
            'I want to learn how to drive every type of vehicle that exists.',
            "I'm secretly fearful of flying vehicles.",
            'Why walk when you can drive?',
            'I love trains so much that I have a miniature train collection set up in my cottage.',
            'If I can\'t drive, I will always call "shotgun" to ride up front.',
            'A few years ago, I crashed a carriage and ran from the scene. To this day, nopony knows.',
            'I like to talk shop about vehicle mechanics and how they work.',
            'I get nervous when somepony else is driving and feel like I will always do a better job.',
            'Driving is soothing to me and a form of self-care.',
            "One day I'll save up enough bits to buy the latest carriage model.",
            "It bothers me when ponies don't take care of their vehicles.",
            'I once spent a summer as a chariot driver for a famous pony, and it was the best summer of my life.',
        ],
    },
];
