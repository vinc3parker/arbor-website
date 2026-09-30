export interface ArborApp {
  id: string;
  name: string;
  /** Domain of life (brand guide 1.6). */
  dimension: string;
  /** The app's lead (primary) colour (brand guide 5.9). */
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
    dimension: 'Money',
    colour: '#FF6B5B',
    angle: -56,
    status: 'beta',
    route: '/nura',
    blurb: 'See how your money is doing and make it work for the life you want.',
  },
  {
    id: 'wend',
    name: 'Wend',
    dimension: 'Experiences',
    colour: '#5A321E',
    angle: -40,
    status: 'development',
    route: '/wend',
    blurb: 'Make the most of your free time, from holidays to nights in.',
  },
  {
    id: 'salus',
    name: 'Salus',
    dimension: 'Mind',
    colour: '#6FD6C9',
    angle: -24,
    status: 'beta',
    route: '/salus',
    blurb: 'Understand your thoughts and handle the life you are living.',
  },
  {
    id: 'aevo',
    name: 'Aevo',
    dimension: 'Health',
    colour: '#D4FF00',
    angle: -8,
    status: 'beta',
    route: '/aevo',
    blurb: 'Your coach for training, recovery and a body ready for anything.',
  },
  {
    id: 'telos',
    name: 'Telos',
    dimension: 'Purpose',
    colour: '#0C375C',
    angle: 8,
    status: 'development',
    route: '/telos',
    blurb: 'Find purpose in your work and build a career that feels like yours.',
  },
  {
    id: 'sage',
    name: 'Sage',
    dimension: 'Growth',
    colour: '#3A2036',
    angle: 24,
    status: 'development',
    route: '/sage',
    blurb: 'Learn what you need to grow, from courses to new curiosities.',
  },
  {
    id: 'kith',
    name: 'Kith',
    dimension: 'Relationships',
    colour: '#EB729A',
    angle: 40,
    status: 'development',
    route: '/kith',
    blurb: 'Stay close to your people and meet new ones you will click with.',
  },
  {
    id: 'thrive',
    name: 'Thrive',
    dimension: 'Organisation',
    colour: '#DC143C',
    angle: 56,
    status: 'development',
    route: '/thrive',
    blurb: 'Your time, habits and routines, shaped around who you want to be.',
  },
];

/** Centre-out lighting order: 0 for the middle pair, 3 for the outermost. */
export function revealRank(app: ArborApp): number {
  return Math.round((Math.abs(app.angle) - 8) / 16);
}
