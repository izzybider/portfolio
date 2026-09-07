/* ============================================================
   COMMONGROUND — ranking

   The product bet lives in this file. Hard constraints, soft preferences
   and vetoes are kept apart and applied in that order, rather than being
   folded into one averaged score:

     1. remove anything that violates a hard constraint for anyone
     2. heavily penalise anything someone has vetoed
     3. maximise the *least* satisfied participant
     4. only then optimise overall group fit

   Step 3 is the whole point. An option that delights three people and
   leaves the fourth miserable loses to an option everyone is fine with,
   which is the opposite of what an average would do.

   Everything is deterministic: the same inputs always produce the same
   ranking, and every line the UI shows is computed here rather than
   written by hand. There is no model and no API — this is a structured
   recommendation and coordination system, not an AI feature.
   ============================================================ */

import type {
  Activity,
  Category,
  FailReason,
  GroupRule,
  Participant,
  Scored,
} from './types';
import { CATEGORY_LABELS } from './activities';

/** How much of a participant's satisfaction each dimension can carry. */
const W_INTEREST = 0.45;
const W_ENERGY = 0.3;
const W_STYLE = 0.25;

/** A veto is not a strong opinion; it removes the option from contention. */
const VETO_PENALTY = 1;

/** Weight on the least-satisfied participant vs. the group average. */
const W_MIN = 0.65;
const W_MEAN = 0.35;

export function hardFailures(a: Activity, p: Participant, groupSize: number) {
  const out: FailReason[] = [];
  if (a.cost > p.maxCost) out.push('over budget');
  if (a.duration > p.maxMinutes) out.push('takes too long');
  if (a.travel > p.maxTravel) out.push('too far');
  if (
    p.settingNeed !== 'no preference' &&
    a.setting !== 'mixed' &&
    a.setting !== p.settingNeed
  ) {
    out.push('wrong setting');
  }
  if (groupSize > a.fits[1]) out.push('group too large');
  if (groupSize < a.fits[0]) out.push('group too small');
  return out;
}

/** 0–1. How well this activity serves one participant's soft preferences. */
export function satisfaction(a: Activity, p: Participant): number {
  const interestIndex = p.interests.indexOf(a.category);
  /* Ranked interests: first choice counts full, later ones taper. */
  const interest =
    interestIndex === -1 ? 0 : Math.max(0.35, 1 - interestIndex * 0.22);
  const energy = 1 - Math.abs(a.energy - p.energy) / 2;
  const style = a.styles.includes(p.style) ? 1 : 0.25;
  return W_INTEREST * interest + W_ENERGY * energy + W_STYLE * style;
}

/** What a rejection reason means for everything else in the list. */
function ruleApplies(rule: GroupRule, a: Activity, rejected: Activity | undefined) {
  if (!rejected) return false;
  switch (rule.reason) {
    case 'too expensive':
      return a.cost >= rejected.cost;
    case 'too far':
      return a.travel >= rejected.travel;
    case 'wrong vibe':
      return a.category === rejected.category;
    case 'wrong timing':
      return a.daypart === rejected.daypart && rejected.daypart !== 'any';
    case 'not interested':
      return a.category === rejected.category;
    case 'other':
      return false;
  }
}

export function describeRule(reason: GroupRule['reason'], a: Activity): string {
  switch (reason) {
    case 'too expensive':
      return `options costing about $${a.cost} or more per person`;
    case 'too far':
      return 'options that need the same amount of travel or more';
    case 'wrong vibe':
      return `other ${CATEGORY_LABELS[a.category].toLowerCase()} options`;
    case 'wrong timing':
      return a.daypart === 'evening' ? 'other evening options' : 'other daytime options';
    case 'not interested':
      return `other ${CATEGORY_LABELS[a.category].toLowerCase()} options`;
    case 'other':
      return 'that option only';
  }
}

export type RankInput = {
  activities: Activity[];
  participants: Participant[];
  /** options the group has already rejected outright */
  removedIds: string[];
  /** soft constraints the group created by rejecting things */
  rules: GroupRule[];
};

export type RankOutput = {
  ranked: Scored[];
  /** feasible and not vetoed, best first */
  shortlist: Scored[];
  /** removed by a hard constraint */
  infeasible: Scored[];
  /** feasible but someone said absolutely not */
  vetoed: Scored[];
  /** categories every participant listed as an interest */
  sharedInterests: Category[];
  /** where the group actually disagrees */
  conflicts: string[];
  /** the binding constraint when nothing survives */
  bindingConstraint: string | null;
};

export function rank({
  activities,
  participants,
  removedIds,
  rules,
}: RankInput): RankOutput {
  const groupSize = participants.length;
  const byId = new Map(activities.map((a) => [a.id, a]));

  const scored: Scored[] = activities
    .filter((a) => !removedIds.includes(a.id))
    .map((a) => {
      const blockers: Scored['blockers'] = [];
      participants.forEach((p) => {
        hardFailures(a, p, groupSize).forEach((reason) =>
          blockers.push({ participant: p.label, reason }),
        );
      });

      const vetoedBy = participants
        .filter((p) => p.vetoes.includes(a.category))
        .map((p) => p.label);

      const sat = participants.map((p) => ({
        participant: p.label,
        value: satisfaction(a, p),
      }));
      const values = sat.map((s) => s.value);
      const minSatisfaction = Math.min(...values);
      const meanSatisfaction = values.reduce((x, y) => x + y, 0) / values.length;

      /* Soft constraints the group added by rejecting earlier options. */
      const ruleHits = rules.filter((r) => ruleApplies(r, a, byId.get(r.activityId)));
      const rulePenalty = ruleHits.length * 0.18;

      const base = W_MIN * minSatisfaction + W_MEAN * meanSatisfaction;
      const raw = base - vetoedBy.length * VETO_PENALTY - rulePenalty;

      const withinBudget = participants.filter((p) => a.cost <= p.maxCost).length;
      const withinTime = participants.filter((p) => a.duration <= p.maxMinutes).length;
      const interested = participants.filter((p) => p.interests.includes(a.category)).length;

      /* Whoever is furthest below the group's own average is compromising. */
      const compromisers = sat
        .filter((s) => s.value < meanSatisfaction - 0.12)
        .sort((x, y) => x.value - y.value)
        .map((s) => s.participant);

      const risks: string[] = [];
      participants.forEach((p) => {
        if (a.cost <= p.maxCost && a.cost > p.maxCost * 0.85) {
          risks.push(`${p.label} is close to their budget limit`);
        }
        if (a.duration <= p.maxMinutes && a.duration > p.maxMinutes * 0.85) {
          risks.push(`${p.label} is close to their time limit`);
        }
      });
      if (ruleHits.length > 0) {
        risks.push(
          `Similar to something the group already turned down (${ruleHits[0].reason})`,
        );
      }

      const sharedReason =
        interested === groupSize
          ? `everyone listed ${CATEGORY_LABELS[a.category].toLowerCase()} as an interest`
          : withinBudget === groupSize && withinTime === groupSize
            ? 'it fits everyone’s budget and time'
            : minSatisfaction > 0.55
              ? 'nobody is unhappy with it'
              : 'it is the least contested option left';

      return {
        activity: a,
        feasible: blockers.length === 0,
        blockers,
        vetoedBy,
        satisfaction: sat,
        minSatisfaction,
        meanSatisfaction,
        fit: Math.round(Math.max(0, Math.min(1, raw)) * 100),
        withinBudget,
        withinTime,
        interested,
        compromisers,
        risks,
        sharedReason,
      };
    });

  /* Order: least-satisfied participant first, then the group average. */
  const order = (x: Scored, y: Scored) => {
    if (x.vetoedBy.length !== y.vetoedBy.length) return x.vetoedBy.length - y.vetoedBy.length;
    if (Math.abs(x.minSatisfaction - y.minSatisfaction) > 0.02) {
      return y.minSatisfaction - x.minSatisfaction;
    }
    if (Math.abs(x.meanSatisfaction - y.meanSatisfaction) > 0.01) {
      return y.meanSatisfaction - x.meanSatisfaction;
    }
    /* Stable, explainable tie-break so equal options do not shuffle. */
    return x.activity.id.localeCompare(y.activity.id);
  };

  const infeasible = scored.filter((s) => !s.feasible);
  const feasible = scored.filter((s) => s.feasible);
  const vetoed = feasible.filter((s) => s.vetoedBy.length > 0).sort(order);
  const shortlist = feasible.filter((s) => s.vetoedBy.length === 0).sort(order);

  /* What the group already agrees on. */
  const sharedInterests = (Object.keys(CATEGORY_LABELS) as Category[]).filter((c) =>
    participants.every((p) => p.interests.includes(c)),
  );

  /* Where they do not. */
  const conflicts: string[] = [];
  const energies = [...new Set(participants.map((p) => p.energy))];
  if (energies.length > 1) {
    const lo = participants.filter((p) => p.energy === Math.min(...energies));
    const hi = participants.filter((p) => p.energy === Math.max(...energies));
    conflicts.push(
      `Energy: ${lo.map((p) => p.label).join(', ')} want something lower-key than ${hi
        .map((p) => p.label)
        .join(', ')}`,
    );
  }
  const budgets = participants.map((p) => p.maxCost);
  if (Math.max(...budgets) - Math.min(...budgets) >= 15) {
    const tightest = participants.find((p) => p.maxCost === Math.min(...budgets))!;
    conflicts.push(`Budget: ${tightest.label} has the tightest ceiling at $${tightest.maxCost}`);
  }
  const times = participants.map((p) => p.maxMinutes);
  if (Math.max(...times) - Math.min(...times) >= 60) {
    const shortest = participants.find((p) => p.maxMinutes === Math.min(...times))!;
    conflicts.push(
      `Time: ${shortest.label} has the least time, ${Math.round(shortest.maxMinutes / 60)}h`,
    );
  }
  const allVetoes = participants.flatMap((p) =>
    p.vetoes.map((v) => `${p.label} ruled out ${CATEGORY_LABELS[v].toLowerCase()}`),
  );
  conflicts.push(...allVetoes);
  const styles = [...new Set(participants.map((p) => p.style))];
  if (styles.length > 1) {
    conflicts.push(`Social style: the group is split across ${styles.length} different preferences`);
  }

  /* If nothing survives, say which constraint is doing the damage. */
  let bindingConstraint: string | null = null;
  if (shortlist.length === 0) {
    const counts = new Map<FailReason, number>();
    infeasible.forEach((s) =>
      s.blockers.forEach((b) => counts.set(b.reason, (counts.get(b.reason) ?? 0) + 1)),
    );
    const worst = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (vetoed.length > 0 && (!worst || vetoed.length >= infeasible.length)) {
      bindingConstraint = 'vetoes';
    } else if (worst) {
      bindingConstraint = worst[0];
    } else {
      bindingConstraint = 'the group has rejected everything';
    }
  }

  return {
    ranked: [...shortlist, ...vetoed, ...infeasible],
    shortlist,
    infeasible,
    vetoed,
    sharedInterests,
    conflicts,
    bindingConstraint,
  };
}
