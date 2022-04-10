import { NomenPart } from "parse-nomen"
export const shortenNomen = (nomen: readonly NomenPart[]) => nomen.filter(part => part.class === "scientific" || part.class === "vernacular" || part.class === "operator")
export default shortenNomen
