import { Nomen } from "../models/types/Nomen.js"
export const stringifyNomen = (nomen: Nomen) => nomen.map(({ text }) => text).join(" ")
export default stringifyNomen
