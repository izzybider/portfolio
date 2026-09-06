/* ============================================================
   SYNTHETIC ACTIVITY SETS

   Invented for this experiment. No venue here is a real business and no
   cost, duration or travel figure describes a real place — they exist to
   give the constraint logic something realistic to bite on.

   Two comparable sets so a group can run two rounds without deciding
   between options they have already argued about. The sets are matched on
   shape: the same category spread, a similar cost range, and a similar
   split of indoor/outdoor and day/evening.
   ============================================================ */

import type { Activity } from './types';

export const SET_A: Activity[] = [
  { id: 'a01', name: 'Farmers market and coffee walk', category: 'relaxed', setting: 'outdoor', cost: 12, duration: 90, energy: 1, food: true, travel: 1, daypart: 'day', fits: [2, 6], styles: ['talk', 'food', 'outdoors'] },
  { id: 'a02', name: 'Neighbourhood hike', category: 'outdoors', setting: 'outdoor', cost: 0, duration: 150, energy: 3, food: false, travel: 2, daypart: 'day', fits: [2, 6], styles: ['outdoors', 'activity'] },
  { id: 'a03', name: 'Board-game cafe', category: 'games', setting: 'indoor', cost: 18, duration: 150, energy: 2, food: true, travel: 1, daypart: 'any', fits: [3, 6], styles: ['talk', 'activity', 'food'] },
  { id: 'a04', name: 'Matinee at the cinema', category: 'culture', setting: 'indoor', cost: 16, duration: 150, energy: 1, food: false, travel: 1, daypart: 'day', fits: [2, 6], styles: ['entertainment'] },
  { id: 'a05', name: 'City art museum', category: 'culture', setting: 'indoor', cost: 20, duration: 120, energy: 1, food: false, travel: 2, daypart: 'day', fits: [2, 5], styles: ['talk', 'entertainment'] },
  { id: 'a06', name: 'Bowling', category: 'games', setting: 'indoor', cost: 22, duration: 120, energy: 2, food: true, travel: 1, daypart: 'any', fits: [3, 6], styles: ['activity', 'entertainment'] },
  { id: 'a07', name: 'Picnic in the park', category: 'outdoors', setting: 'outdoor', cost: 10, duration: 120, energy: 1, food: true, travel: 1, daypart: 'day', fits: [2, 6], styles: ['talk', 'food', 'outdoors'] },
  { id: 'a08', name: 'Escape room', category: 'games', setting: 'indoor', cost: 32, duration: 90, energy: 2, food: false, travel: 2, daypart: 'any', fits: [3, 6], styles: ['activity', 'entertainment'] },
  { id: 'a09', name: 'Casual dinner out', category: 'food', setting: 'indoor', cost: 30, duration: 120, energy: 1, food: true, travel: 1, daypart: 'evening', fits: [2, 6], styles: ['talk', 'food'] },
  { id: 'a10', name: 'Live music at a small venue', category: 'nightlife', setting: 'indoor', cost: 28, duration: 180, energy: 2, food: false, travel: 2, daypart: 'evening', fits: [2, 6], styles: ['entertainment'] },
  { id: 'a11', name: 'Mini golf', category: 'games', setting: 'outdoor', cost: 15, duration: 90, energy: 2, food: false, travel: 2, daypart: 'any', fits: [2, 6], styles: ['activity', 'entertainment'] },
  { id: 'a12', name: 'Beach afternoon', category: 'outdoors', setting: 'outdoor', cost: 5, duration: 240, energy: 2, food: false, travel: 3, daypart: 'day', fits: [2, 6], styles: ['outdoors', 'talk'] },
  { id: 'a13', name: 'Coffee and a long walk', category: 'relaxed', setting: 'outdoor', cost: 8, duration: 90, energy: 1, food: true, travel: 1, daypart: 'any', fits: [2, 4], styles: ['talk', 'outdoors'] },
  { id: 'a14', name: 'Watch party at home', category: 'relaxed', setting: 'indoor', cost: 8, duration: 180, energy: 1, food: true, travel: 1, daypart: 'evening', fits: [2, 6], styles: ['entertainment', 'food', 'talk'] },
  { id: 'a15', name: 'Bakery crawl', category: 'food', setting: 'mixed', cost: 18, duration: 120, energy: 2, food: true, travel: 2, daypart: 'day', fits: [2, 5], styles: ['food', 'talk'] },
  { id: 'a16', name: 'Climbing gym session', category: 'active', setting: 'indoor', cost: 26, duration: 120, energy: 3, food: false, travel: 2, daypart: 'any', fits: [2, 5], styles: ['activity'] },
  { id: 'a17', name: 'Thrift and record shops', category: 'shopping', setting: 'indoor', cost: 14, duration: 120, energy: 2, food: false, travel: 1, daypart: 'day', fits: [2, 4], styles: ['talk', 'activity'] },
  { id: 'a18', name: 'Karaoke room', category: 'nightlife', setting: 'indoor', cost: 24, duration: 120, energy: 3, food: false, travel: 2, daypart: 'evening', fits: [3, 6], styles: ['entertainment', 'activity'] },
  { id: 'a19', name: 'Botanical garden', category: 'outdoors', setting: 'outdoor', cost: 14, duration: 120, energy: 1, food: false, travel: 2, daypart: 'day', fits: [2, 6], styles: ['outdoors', 'talk'] },
  { id: 'a20', name: 'Late brunch', category: 'food', setting: 'indoor', cost: 24, duration: 105, energy: 1, food: true, travel: 1, daypart: 'day', fits: [2, 6], styles: ['food', 'talk'] },
];

export const SET_B: Activity[] = [
  { id: 'b01', name: 'Street food market', category: 'food', setting: 'mixed', cost: 16, duration: 105, energy: 2, food: true, travel: 1, daypart: 'day', fits: [2, 6], styles: ['food', 'talk'] },
  { id: 'b02', name: 'Riverside walk', category: 'outdoors', setting: 'outdoor', cost: 0, duration: 120, energy: 2, food: false, travel: 1, daypart: 'day', fits: [2, 6], styles: ['outdoors', 'talk'] },
  { id: 'b03', name: 'Arcade bar', category: 'games', setting: 'indoor', cost: 22, duration: 150, energy: 2, food: true, travel: 2, daypart: 'evening', fits: [3, 6], styles: ['activity', 'entertainment'] },
  { id: 'b04', name: 'Repertory film screening', category: 'culture', setting: 'indoor', cost: 14, duration: 150, energy: 1, food: false, travel: 2, daypart: 'evening', fits: [2, 6], styles: ['entertainment'] },
  { id: 'b05', name: 'History museum', category: 'culture', setting: 'indoor', cost: 18, duration: 120, energy: 1, food: false, travel: 2, daypart: 'day', fits: [2, 5], styles: ['talk', 'entertainment'] },
  { id: 'b06', name: 'Pool hall', category: 'games', setting: 'indoor', cost: 20, duration: 120, energy: 2, food: false, travel: 1, daypart: 'evening', fits: [2, 6], styles: ['activity', 'talk'] },
  { id: 'b07', name: 'Sunset picnic', category: 'outdoors', setting: 'outdoor', cost: 12, duration: 120, energy: 1, food: true, travel: 2, daypart: 'evening', fits: [2, 6], styles: ['talk', 'food', 'outdoors'] },
  { id: 'b08', name: 'Trivia night', category: 'games', setting: 'indoor', cost: 18, duration: 150, energy: 2, food: true, travel: 1, daypart: 'evening', fits: [3, 6], styles: ['talk', 'entertainment'] },
  { id: 'b09', name: 'Ramen and dessert', category: 'food', setting: 'indoor', cost: 28, duration: 105, energy: 1, food: true, travel: 1, daypart: 'evening', fits: [2, 5], styles: ['food', 'talk'] },
  { id: 'b10', name: 'Comedy show', category: 'nightlife', setting: 'indoor', cost: 30, duration: 150, energy: 2, food: false, travel: 2, daypart: 'evening', fits: [2, 6], styles: ['entertainment'] },
  { id: 'b11', name: 'Batting cages', category: 'active', setting: 'outdoor', cost: 16, duration: 90, energy: 3, food: false, travel: 2, daypart: 'day', fits: [2, 6], styles: ['activity'] },
  { id: 'b12', name: 'Lake day', category: 'outdoors', setting: 'outdoor', cost: 8, duration: 240, energy: 2, food: false, travel: 3, daypart: 'day', fits: [2, 6], styles: ['outdoors', 'talk'] },
  { id: 'b13', name: 'Tea house and a wander', category: 'relaxed', setting: 'mixed', cost: 10, duration: 90, energy: 1, food: true, travel: 1, daypart: 'any', fits: [2, 4], styles: ['talk', 'food'] },
  { id: 'b14', name: 'Game night at home', category: 'relaxed', setting: 'indoor', cost: 6, duration: 180, energy: 1, food: true, travel: 1, daypart: 'evening', fits: [3, 6], styles: ['talk', 'activity', 'food'] },
  { id: 'b15', name: 'Bookshop and coffee', category: 'shopping', setting: 'indoor', cost: 14, duration: 105, energy: 1, food: true, travel: 1, daypart: 'day', fits: [2, 4], styles: ['talk', 'food'] },
  { id: 'b16', name: 'Bouldering session', category: 'active', setting: 'indoor', cost: 24, duration: 120, energy: 3, food: false, travel: 2, daypart: 'any', fits: [2, 5], styles: ['activity'] },
  { id: 'b17', name: 'Vintage market', category: 'shopping', setting: 'mixed', cost: 15, duration: 120, energy: 2, food: false, travel: 2, daypart: 'day', fits: [2, 5], styles: ['talk', 'activity'] },
  { id: 'b18', name: 'Dancing', category: 'nightlife', setting: 'indoor', cost: 26, duration: 180, energy: 3, food: false, travel: 2, daypart: 'evening', fits: [3, 6], styles: ['activity', 'entertainment'] },
  { id: 'b19', name: 'Conservatory and gardens', category: 'outdoors', setting: 'mixed', cost: 16, duration: 120, energy: 1, food: false, travel: 2, daypart: 'day', fits: [2, 6], styles: ['outdoors', 'talk'] },
  { id: 'b20', name: 'Diner breakfast', category: 'food', setting: 'indoor', cost: 20, duration: 90, energy: 1, food: true, travel: 1, daypart: 'day', fits: [2, 6], styles: ['food', 'talk'] },
];

export const ACTIVITY_SETS: Record<string, { label: string; items: Activity[] }> = {
  A: { label: 'Set A', items: SET_A },
  B: { label: 'Set B', items: SET_B },
};

export const CATEGORY_LABELS: Record<string, string> = {
  outdoors: 'Outdoors',
  food: 'Food',
  culture: 'Culture',
  games: 'Games',
  nightlife: 'Nightlife',
  relaxed: 'Low-key',
  active: 'Active',
  shopping: 'Browsing',
};

export const STYLE_LABELS: Record<string, string> = {
  talk: 'Talking',
  activity: 'Doing something',
  entertainment: 'Being entertained',
  food: 'Eating',
  outdoors: 'Being outside',
};

export const ENERGY_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
};

export const TRAVEL_LABELS: Record<number, string> = {
  1: 'Nearby only',
  2: 'A short trip is fine',
  3: 'Happy to travel',
};
