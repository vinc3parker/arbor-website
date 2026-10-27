// Choices offered in the business portal. Values are Arbor Core slugs
// (activity taxonomy plus `classes`; organisation kinds).

export const BUSINESS_KINDS: Array<[string, string]> = [
  ["venue", "Pub, bar, café, restaurant or venue"],
  ["gym", "Gym or health club"],
  ["studio", "Studio"],
  ["club", "Club"],
  ["team", "Team"],
  ["class_provider", "Instructor or class provider"],
  ["learning_provider", "Workshops or courses (pottery, painting, glass…)"],
  ["hobby_group", "Hobby or social group"],
  ["event_host", "Events organiser"],
];

export const OFFERINGS: Array<[string, string]> = [
  ["gym", "Gym floor"],
  ["classes", "Fitness classes"],
  ["yoga", "Yoga"],
  ["pilates", "Pilates"],
  ["spin", "Spin"],
  ["hiit", "HIIT"],
  ["functional", "CrossFit / functional"],
  ["boxing", "Boxing"],
  ["martial_arts", "Martial arts"],
  ["dance", "Dance"],
  ["swim", "Swimming"],
  ["run", "Running"],
  ["cycling", "Cycling"],
  ["squash", "Squash"],
  ["tennis", "Tennis"],
  ["padel", "Padel"],
  ["badminton", "Badminton"],
  ["football", "Football"],
  ["rugby", "Rugby"],
  ["netball", "Netball"],
  ["hockey", "Hockey"],
  ["cricket", "Cricket"],
  ["climbing", "Climbing"],
];

export const SESSION_KINDS: Array<[string, string]> = [
  ["class", "Class"],
  ["training", "Club training"],
  ["open_session", "Open session"],
];

/** Monday-first for display; values follow Core's 0 = Sunday convention. */
export const DAYS: Array<[number, string]> = [
  [1, "Monday"],
  [2, "Tuesday"],
  [3, "Wednesday"],
  [4, "Thursday"],
  [5, "Friday"],
  [6, "Saturday"],
  [0, "Sunday"],
];

export function offeringLabel(slug: string): string {
  return OFFERINGS.find(([value]) => value === slug)?.[1] ?? slug.replaceAll("_", " ");
}

export function kindLabel(slug: string): string {
  return BUSINESS_KINDS.find(([value]) => value === slug)?.[1] ?? slug.replaceAll("_", " ");
}
