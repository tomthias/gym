export const APP_NAME = "Physio-Track";
export const APP_DESCRIPTION = "Physical rehabilitation tracking app";

export const EXERCISE_CATEGORIES = [
  "core",
  "lower_body",
  "upper_body",
  "cardio",
  "flexibility",
  "balance",
  "general",
] as const;

export const PAIN_COLORS = {
  low: "text-sage-600 bg-sage-100",
  mid: "text-amber-600 bg-amber-100",
  high: "text-red-600 bg-red-100",
} as const;

export function getPainColor(score: number) {
  if (score <= 3) return PAIN_COLORS.low;
  if (score <= 6) return PAIN_COLORS.mid;
  return PAIN_COLORS.high;
}

export const INVITE_CODE_LENGTH = 6;
export const INVITE_CODE_EXPIRY_DAYS = 7;
