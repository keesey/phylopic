import { Nomen } from "../models/types/Nomen.js"
export const shortenNomen = (nomen: Nomen) =>
    nomen.filter(part => part.class === "scientific" || part.class === "vernacular" || part.class === "operator")
export default shortenNomen
