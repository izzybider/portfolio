/* ============================================================
   COMMONGROUND — types

   A small consumer-product experiment about group decisions.
   Everything here runs in the browser. There is no account, no
   database, no network call, and nothing is uploaded.
   ============================================================ */

export type Category =
  | 'outdoors'
  | 'food'
  | 'culture'
  | 'games'
  | 'nightlife'
  | 'relaxed'
  | 'active'
  | 'shopping';

export type Daypart = 'day' | 'evening' | 'any';
export type Setting = 'indoor' | 'outdoor' | 'mixed';
/** 1 low, 2 medium, 3 high */
export type Level = 1 | 2 | 3;

export type SocialStyle = 'talk' | 'activity' | 'entertainment' | 'food' | 'outdoors';

export type Activity = {
  id: string;
  name: string;
  category: Category;
  setting: Setting;
  /** approximate per-person cost, USD */
  cost: number;
  /** minutes, door to door */
  duration: number;
  energy: Level;
  food: boolean;
  /** 1 nearby, 2 a short trip, 3 a real journey */
  travel: Level;
  daypart: Daypart;
  /** the group sizes this comfortably works for */
  fits: [number, number];
  /** which social styles it serves */
  styles: SocialStyle[];
};

export type Participant = {
  /** "Person 1" … no names, emails or demographics are ever collected */
  id: number;
  label: string;
  /** hard constraints */
  maxCost: number;
  maxMinutes: number;
  maxTravel: Level;
  settingNeed: Setting | 'no preference';
  /** soft preferences */
  interests: Category[];
  energy: Level;
  style: SocialStyle;
  /** hard no */
  vetoes: Category[];
  /** optional, one line */
  want: string;
};

export type FailReason =
  | 'over budget'
  | 'takes too long'
  | 'too far'
  | 'wrong setting'
  | 'group too large'
  | 'group too small';

export type Scored = {
  activity: Activity;
  feasible: boolean;
  /** who fails a hard constraint, and why */
  blockers: { participant: string; reason: FailReason }[];
  /** who has vetoed this activity's category */
  vetoedBy: string[];
  /** 0–1 per participant */
  satisfaction: { participant: string; value: number }[];
  minSatisfaction: number;
  meanSatisfaction: number;
  /** 0–100, what the UI shows */
  fit: number;
  /** counts used in the explanation lines */
  withinBudget: number;
  withinTime: number;
  interested: number;
  /** participants asked to compromise most */
  compromisers: string[];
  /** near-miss constraints worth flagging */
  risks: string[];
  sharedReason: string;
};

/** A reaction the group gives to a shortlisted option. */
export type Reaction = 'love' | 'maybe' | 'veto';

export type VetoReason =
  | 'too expensive'
  | 'too far'
  | 'wrong vibe'
  | 'wrong timing'
  | 'not interested'
  | 'other';

/** A soft constraint the group added by rejecting something. */
export type GroupRule = {
  id: string;
  by: string;
  reason: VetoReason;
  activityId: string;
  activityName: string;
  /** plain-English description of what it now down-ranks */
  effect: string;
};

export type Condition = 'baseline' | 'commonground';

export type RoundResult = {
  condition: Condition;
  setId: string;
  groupSize: number;
  /** milliseconds from round start to a final choice */
  timeToDecisionMs: number | null;
  decisionReached: boolean;
  chosenActivityId: string | null;
  optionsConsidered: number;
  vetoCount: number;
  confidence: number | null;
  fairness: number | null;
  frustration: number | null;
  satisfaction: number | null;
  reuse: 'yes' | 'maybe' | 'no' | null;
  comment: string;
};

export type SessionSummary = {
  sessionId: string;
  createdAt: string;
  twoRound: boolean;
  rounds: RoundResult[];
};
