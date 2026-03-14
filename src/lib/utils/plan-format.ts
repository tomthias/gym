import type { PlanItem } from "@/components/physio/plan-editor";

/**
 * Parse shorthand serie x reps notation into PlanItem fields.
 *
 * Supported formats:
 *  "3X10"        → 3 sets of 10 reps
 *  "3x30\""      → 3 sets of 30 seconds (timed)
 *  "5'"          → 5 minutes timed (1 set, 300s)
 *  "30-15-15-15" → BFR-style multi-rep scheme (4 sets, reps=30)
 */
export function parseSerieReps(
  text: string
): Partial<Pick<PlanItem, "sets" | "reps" | "duration" | "type" | "notes">> {
  const trimmed = text.trim();
  if (!trimmed) return {};

  // Pattern: "5'" or "10'" — minutes timed (single block)
  const minuteMatch = trimmed.match(/^(\d+)'$/);
  if (minuteMatch) {
    return {
      sets: 1,
      duration: parseInt(minuteMatch[1]) * 60,
      type: "timed",
    };
  }

  // Pattern: "3X30\"" or "3x30"" — sets x seconds (timed)
  const timedMatch = trimmed.match(/^(\d+)\s*[Xx]\s*(\d+)["""]$/);
  if (timedMatch) {
    return {
      sets: parseInt(timedMatch[1]),
      duration: parseInt(timedMatch[2]),
      type: "timed",
    };
  }

  // Pattern: "3X10" or "3x10" — sets x reps
  const repsMatch = trimmed.match(/^(\d+)\s*[Xx]\s*(\d+)$/);
  if (repsMatch) {
    return {
      sets: parseInt(repsMatch[1]),
      reps: parseInt(repsMatch[2]),
      type: "reps",
    };
  }

  // Pattern: "30-15-15-15" — BFR/variable rep scheme
  const bfrMatch = trimmed.match(/^(\d+)(-\d+)+$/);
  if (bfrMatch) {
    const parts = trimmed.split("-").map(Number);
    return {
      sets: parts.length,
      reps: parts[0],
      type: "reps",
      notes: `Schema: ${trimmed}`,
    };
  }

  return {};
}

/**
 * Format PlanItem fields into shorthand display text.
 */
export function formatSerieReps(item: PlanItem): string {
  // Check if notes contain a BFR schema pattern
  const schemaMatch = item.notes?.match(/Schema:\s*([\d-]+)/i);
  if (schemaMatch) return schemaMatch[1];

  if (item.type === "timed") {
    if (item.sets === 1 && item.duration >= 60 && item.duration % 60 === 0) {
      return `${item.duration / 60}'`;
    }
    return `${item.sets}X${item.duration}"`;
  }

  return `${item.sets}X${item.reps}`;
}

/**
 * Parse rest notation.
 *
 * Supported formats:
 *  "1'"    → 60 seconds
 *  "SS"    → superset marker (10s transition rest)
 *  "90"    → 90 seconds
 *  "90\""  → 90 seconds
 *  "1'30"  → 90 seconds
 *  "/"     → no rest (0)
 */
export function parseRest(
  text: string
): { restTime: number; isSuperset: boolean } {
  const trimmed = text.trim().toUpperCase();

  if (!trimmed || trimmed === "/" || trimmed === "-")
    return { restTime: 0, isSuperset: false };

  if (trimmed === "SS") return { restTime: 10, isSuperset: true };

  // "1'" or "2'" — minutes
  const minMatch = trimmed.match(/^(\d+)'$/);
  if (minMatch) return { restTime: parseInt(minMatch[1]) * 60, isSuperset: false };

  // "1'30" or "1'30\"" — minutes + seconds
  const minSecMatch = trimmed.match(/^(\d+)'(\d+)[""]?$/);
  if (minSecMatch) {
    return {
      restTime: parseInt(minSecMatch[1]) * 60 + parseInt(minSecMatch[2]),
      isSuperset: false,
    };
  }

  // "90" or "90\"" — just seconds
  const secMatch = trimmed.match(/^(\d+)[""]?$/);
  if (secMatch) return { restTime: parseInt(secMatch[1]), isSuperset: false };

  return { restTime: 60, isSuperset: false };
}

/**
 * Format rest from PlanItem into display text.
 */
export function formatRest(item: PlanItem): string {
  if (item.supersetGroup != null) return "SS";

  const seconds = item.restTime;
  if (seconds === 0) return "/";
  if (seconds % 60 === 0) return `${seconds / 60}'`;
  if (seconds < 60) return `${seconds}"`;
  return `${Math.floor(seconds / 60)}'${seconds % 60}"`;
}

/**
 * Generate row labels like A1, B1, C1...
 * Superset groups get sub-labels: A1, A2 for items sharing a group.
 */
export function generateRowLabels(items: PlanItem[]): string[] {
  const labels: string[] = [];
  let letterIndex = 0;
  let i = 0;

  while (i < items.length) {
    const letter = String.fromCharCode(65 + letterIndex);

    if (items[i].supersetGroup != null) {
      const group = items[i].supersetGroup;
      let subIndex = 1;
      while (i < items.length && items[i].supersetGroup === group) {
        labels.push(`${letter}${subIndex}`);
        subIndex++;
        i++;
      }
    } else {
      labels.push(`${letter}1`);
      i++;
    }
    letterIndex++;
  }

  return labels;
}
