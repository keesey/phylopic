import { Nomen } from "../models/types/Nomen"
export const stringifyNomen = (nomen: Nomen) => nomen.map(({ text }) => text).join(" ")
export default stringifyNomen
