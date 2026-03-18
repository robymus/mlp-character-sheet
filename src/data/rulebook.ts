// This is a placeholder list based on the MLP rulebook.
// You can expand this list later with the exact rulebook definitions.

export const INFLUENCES: Record<string, string[]> = {
  'Artisan': [
    'My work is my life.',
    'I owe my success to a generous patron.',
    'I am always looking for the perfect material.'
  ],
  'Athlete': [
    'I have a rival who pushes me to be better.',
    'My team is my family.',
    'I will never give up, no matter the score.'
  ],
  'Bureaucrat': [
    'Rules keep everything running smoothly.',
    'I have a contact in every department.',
    'The paperwork must be perfect.'
  ],
  'Entertainer': [
    'The show must go on!',
    'I thrive on the applause of the crowd.',
    'My biggest fan is my biggest inspiration.'
  ],
  'Explorer': [
    'There is always another horizon to discover.',
    'I trust my maps with my life.',
    'Danger is just excitement with a risk.'
  ],
  'Farmer': [
    'The land provides for those who care for it.',
    'A hard day\'s work is its own reward.',
    'My animals are my best friends.'
  ],
  'Scholar': [
    'Knowledge is the true magic.',
    'I must read every book in the library.',
    'My mentor taught me everything I know.'
  ]
};

export const INFLUENCE_NAMES = Object.keys(INFLUENCES);

export const GENERAL_PERKS: Record<string, { description: string, reqSkill?: Record<string, number> }> = {
  'Animal Pet': {
    description: 'You have a loyal animal companion.'
  },
  'Bookworm': {
    description: 'You are well-read and gain bonuses to research.',
    reqSkill: { 'culture': 1 }
  },
  'Athletic': {
    description: 'You are naturally fit, gaining movement bonuses.',
    reqSkill: { 'athletics': 1, 'brawn': 1 }
  },
  'Acrobatic': {
    description: 'You are extremely nimble.',
    reqSkill: { 'acrobatics': 2 }
  },
  'Spellcasting': {
    description: 'You can cast magic. (This perk is restricted and auto-added for unicorns via magic logic)'
  }
};
export const GENERAL_PERK_NAMES = Object.keys(GENERAL_PERKS);
