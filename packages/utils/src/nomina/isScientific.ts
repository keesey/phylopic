import { Nomen } from "../models/types/Nomen"
export const isScientific = (name: Nomen) =>
    name.some(part => part.class === "scientific") && name.every(part => part.class !== "operator")
export default isScientific
