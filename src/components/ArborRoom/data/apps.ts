export interface ArborApp {
  id: string;
  name: string;
  dimension: string;
  colour: string;
  /** Position along the curved wall, degrees from its centre. */
  angle: number;
  status: 'development' | 'beta' | 'live';
  route: string;
  /** One calm sentence for the portal's info card. */
  blurb: string;
}

export const arborApps: ArborApp[] = [
  {
    id: 'nura',
    name: 'Nura',
    dimension: 'Financial Wellbeing',
    colour: '#1F6F78',
    angle: -56,
    status: 'beta',
    route: '/nura',
    blurb: 'Understand, shape and grow your financial life.',
  },
  {
    id: 'wend',
    name: 'Wend',
    dimension: 'Life Experiences',
    colour: '#F28C28',
    angle: -40,
    status: 'development',
    route: '/wend',
    blurb: 'Chart the adventures, places and moments that make life rich.',
  },
  {
    id: 'salus',
    name: 'Salus',
    dimension: 'Mental Wellbeing',
    colour: '#38C5A2',
    angle: -24,
    status: 'beta',
    route: '/salus',
    blurb: 'A calm companion for a clearer, steadier mind.',
  },
  {
    id: 'aevo',
    name: 'Aevo',
    dimension: 'Physical Wellbeing',
    colour: '#D4FF00',
    angle: -8,
    status: 'beta',
    route: '/aevo',
    blurb: 'Train, recover and build a lifetime of physical progress.',
  },
  {
    id: 'telos',
    name: 'Telos',
    dimension: 'Purpose & Contribution',
    colour: '#C89B3C',
    angle: 8,
    status: 'development',
    route: '/telos',
    blurb: 'Find your direction and give your energy to what counts.',
  },
  {
    id: 'sage',
    name: 'Sage',
    dimension: 'Lifelong Growth',
    colour: '#5C6BC0',
    angle: 24,
    status: 'development',
    route: '/sage',
    blurb: 'Learn deliberately — knowledge and skills that compound.',
  },
  {
    id: 'kith',
    name: 'Kith',
    dimension: 'Meaningful Connection',
    colour: '#D96C8A',
    angle: 40,
    status: 'development',
    route: '/kith',
    blurb: 'Nurture the relationships that matter most.',
  },
  {
    id: 'thrive',
    name: 'Thrive',
    dimension: 'Intentional Living',
    colour: '#E85D5D',
    angle: 56,
    status: 'development',
    route: '/thrive',
    blurb: 'Design days that add up to the life you actually want.',
  },
];

/** Centre-out lighting order: 0 for the middle pair, 3 for the outermost. */
export function revealRank(app: ArborApp): number {
  return Math.round((Math.abs(app.angle) - 8) / 16);
}
