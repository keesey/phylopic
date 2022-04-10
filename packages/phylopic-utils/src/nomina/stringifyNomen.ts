import { NomenPart } from "parse-nomen"
export const stringifyNomen = (nomen: readonly NomenPart[]) => nomen.map(({ text }) => text).join(" ")
export default stringifyNomen
