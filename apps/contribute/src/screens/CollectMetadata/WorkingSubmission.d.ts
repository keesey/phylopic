import { Contribution } from "@phylopic/source-models"
export type WorkingSubmission = Partial<Omit<Contribution, "contributor" | "created" | "uuid">>
