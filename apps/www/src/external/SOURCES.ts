import { type AgeResult } from "./AgeResult"
export type AgeSource = Pick<AgeResult, "source" | "sourceTitle">
export const PALEOBIOLOGY_DATABASE: AgeSource = {
    source: "https://paleobiodb.org/",
    sourceTitle: "Paleobiology Database",
}
export const TIMETREE: AgeSource = {
    source: "https://timetree.org/",
    sourceTitle: "Timetree of Life",
}
