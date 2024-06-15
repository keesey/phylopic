import { type AgeResult } from "./AgeResult"
export type AgeSource = Pick<AgeResult, "source" | "sourceTitle">
export const PALEOBIOLOGY_DATABASE: AgeSource = {
    source: "https://paleobiodb.org/",
    sourceTitle: "Paleobiology Database",
}
export const SMITHSONIAN_HUMAN_ORIGINS: AgeSource = {
    source: "https://humanorigins.si.edu/",
    sourceTitle: "The Smithsonian Institution's Human Origins Program",
}
export const TIMETREE: AgeSource = {
    source: "https://timetree.org/",
    sourceTitle: "Timetree of Life",
}
export const WIKIPEDIA: AgeSource = {
    source: "https://www.wikipedia.org/",
    sourceTitle: "Wikipedia",
}
