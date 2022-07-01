import { Contribution } from "@phylopic/source-models"
export type Submission = Partial<Omit<Contribution, "contributor" | "uuid">>
