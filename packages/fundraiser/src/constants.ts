export const DEFAULT_GOAL_CENTS = 100_000

export const CURRENCY = "USD"

export const FUNDRAISER_MONTHS_UTC = [4, 9] as const

/** Campaigns whose banner is hidden on the public site. Donations are still recorded. */
export const HIDDEN_CAMPAIGN_IDS: readonly string[] = ["2026-10"]
