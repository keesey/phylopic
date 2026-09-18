import type { Contribution } from "@phylopic/source-models"

export type UsageResult = Pick<Contribution, "attribution" | "license">
