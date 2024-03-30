import { type UUID } from "@phylopic/utils"
import { type AgeResult } from "./AgeResult"
import { TIMETREE } from "./SOURCES"
// :KLUDGE: Some rootward nodes are tough to look up via APIs and their estimates are stable.
const PREDEFINED: Record<UUID, AgeResult | null | undefined> = {
    // Biota
    "d2a5e07b-bf10-4733-96f2-cae5a807fc83": {
        ...TIMETREE,
        ages: [4250000000, 4250000000],
    },
    // Pan-Biota
    "8f901db5-84c1-4dc0-93ba-2300eeddf4ab": null,
}
export default PREDEFINED
