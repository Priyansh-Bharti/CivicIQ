import { ElectionPhase } from '../types/election';

export const ELECTION_PHASES: ElectionPhase[] = [
  {
    id: '1',
    name: 'Primary Elections and Caucuses',
    duration: 'January – June',
    description: 'During this phase, political parties choose their candidates for the general election through a series of state-by-state contests. Voters participate in either a primary election or a caucus to select delegates who will represent their preferred candidate at the national convention.',
    keyActors: ['Voters', 'Political Parties', 'Candidates', 'State Election Officials'],
    steps: [
      'Candidates file for candidacy in various states',
      'Voters register and research candidate platforms',
      'Caucuses and primary elections are held across the country',
      'Delegates are awarded based on election results',
      'Unsuccessful candidates drop out of the race'
    ],
    status: 'pending'
  },
  {
    id: '2',
    name: 'National Conventions',
    duration: 'July – August',
    description: 'The major political parties hold national conventions to officially select their nominees for President and Vice President. These events serve to unify the party, establish a formal platform, and kick off the general election campaign with high-profile speeches and media coverage.',
    keyActors: ['Delegates', 'Party Leaders', 'Presidential Nominees', 'Media'],
    steps: [
      'Delegates from all states gather at the convention site',
      'The party platform is debated and officially adopted',
      'Roll call vote is held to formally nominate the President',
      'The Presidential nominee selects and announces a running mate',
      'Acceptance speeches are delivered to close the convention'
    ],
    status: 'pending'
  },
  {
    id: '3',
    name: 'General Election Campaign',
    duration: 'September – October',
    description: 'Nominees from all parties compete for the support of the entire national electorate. This phase is characterized by intense travel, nationwide advertising, and televised debates where candidates present their visions for the country and challenge their opponents positions.',
    keyActors: ['Nominees', 'Campaign Staff', 'Debate Commission', 'Undecided Voters'],
    steps: [
      'Candidates focus campaigning on "swing states"',
      'Presidential and Vice Presidential debates are conducted',
      'Massive fundraising and advertising efforts intensify',
      'Voter registration deadlines pass in most states',
      'Early and mail-in voting begins in many jurisdictions'
    ],
    status: 'pending'
  },
  {
    id: '4',
    name: 'Election Day',
    duration: 'First Tuesday in November',
    description: 'The culmination of the public voting process where millions of citizens cast their ballots. While many vote early, the majority of the nation focuses on this single day to determine the popular vote in each state, which in turn dictates the allocation of electoral votes.',
    keyActors: ['Registered Voters', 'Poll Workers', 'Election Observers', 'Media Outlets'],
    steps: [
      'Polling places open nationwide for in-person voting',
      'Ballots are cast and securely stored or processed',
      'Polls close and preliminary results are reported',
      'Absentee and mail-in ballots are verified and counted',
      'Major networks project winners based on exit polls and returns'
    ],
    status: 'pending'
  },
  {
    id: '5',
    name: 'The Electoral College',
    duration: 'December',
    description: 'In the U.S. system, the President is not elected by direct popular vote but by electors. Following the general election, electors meet in their respective states to cast official votes for President and Vice President, which are then sent to Congress for certification.',
    keyActors: ['Electors', 'State Governors', 'Secretary of State', 'Archivist of the U.S.'],
    steps: [
      'States certify their final popular vote results',
      'Electors meet in their states to cast their official ballots',
      'Certificates of Vote are signed and sent to Washington D.C.',
      'State officials resolve any disputes regarding the count',
      'The Vice President receives the certified results as President of the Senate'
    ],
    status: 'pending'
  },
  {
    id: '6',
    name: 'Inauguration',
    duration: 'January 20',
    description: 'The formal ceremony where the President-elect and Vice President-elect take the oath of office and officially begin their four-year terms. This transition of power is a hallmark of American democracy, involving a public ceremony, inaugural address, and celebratory events.',
    keyActors: ['President-elect', 'Chief Justice of the Supreme Court', 'Congress', 'Public'],
    steps: [
      'Congress meets in a joint session to count electoral votes',
      'The Vice President announces the official winner',
      'The outgoing administration prepares for the transition of power',
      'The President-elect takes the oath of office at the U.S. Capitol',
      'The new President delivers the inaugural address'
    ],
    status: 'pending'
  }
];

export const CIVIC_CHECKLIST = [
  {
    id: '1',
    title: 'Register to vote',
    description: 'Check if you are registered at your current address. Requirements vary by country and region.',
    link: 'https://vote.gov',
    completed: false
  },
  {
    id: '2',
    title: 'Understand voter ID requirements',
    description: 'Learn what identification you may need to bring to your polling station.',
    completed: false
  },
  {
    id: '3',
    title: 'Find your polling station',
    description: 'Locate your assigned polling place and note the opening hours.',
    completed: false
  },
  {
    id: '4',
    title: 'Know your ballot',
    description: 'Research what offices and measures will appear on your ballot before election day.',
    completed: false
  },
  {
    id: '5',
    title: 'Understand how votes are counted',
    description: 'Learn the counting process in your area — hand count, machine count, or a combination.',
    completed: false
  },
  {
    id: '6',
    title: 'Plan your voting day',
    description: 'Decide when you will vote, arrange transport if needed, and factor in expected wait times.',
    completed: false
  },
  {
    id: '7',
    title: 'Verify your registration is active',
    description: 'Confirm your registration has not been removed and your details are correct.',
    completed: false
  }
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English',     nativeName: 'English',          flag: '🇬🇧', dir: 'ltr' },
  { code: 'hi', name: 'Hindi',       nativeName: 'हिन्दी',            flag: '🇮🇳', dir: 'ltr' },
  { code: 'bn', name: 'Bengali',     nativeName: 'বাংলা',            flag: '🇮🇳', dir: 'ltr' },
  { code: 'te', name: 'Telugu',      nativeName: 'తెలుగు',           flag: '🇮🇳', dir: 'ltr' },
  { code: 'mr', name: 'Marathi',     nativeName: 'मराठी',            flag: '🇮🇳', dir: 'ltr' },
  { code: 'ta', name: 'Tamil',       nativeName: 'தமிழ்',            flag: '🇮🇳', dir: 'ltr' },
  { code: 'ur', name: 'Urdu',        nativeName: 'اردو',             flag: '🇮🇳', dir: 'rtl' },
  { code: 'gu', name: 'Gujarati',    nativeName: 'ગુજરાતી',          flag: '🇮🇳', dir: 'ltr' },
  { code: 'kn', name: 'Kannada',     nativeName: 'ಕನ್ನಡ',            flag: '🇮🇳', dir: 'ltr' },
  { code: 'ml', name: 'Malayalam',   nativeName: 'മലയാളം',          flag: '🇮🇳', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi',     nativeName: 'ਪੰਜਾਬੀ',           flag: '🇮🇳', dir: 'ltr' },
  { code: 'zh', name: 'Chinese',     nativeName: '中文',              flag: '🇨🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish',     nativeName: 'Español',          flag: '🇪🇸', dir: 'ltr' },
  { code: 'ar', name: 'Arabic',      nativeName: 'العربية',          flag: '🇸🇦', dir: 'rtl' },
  { code: 'fr', name: 'French',      nativeName: 'Français',         flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German',      nativeName: 'Deutsch',          flag: '🇩🇪', dir: 'ltr' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
export type LanguageDir = 'ltr' | 'rtl';
