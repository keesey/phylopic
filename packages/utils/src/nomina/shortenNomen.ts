import { Nomen } from "../models/types/Nomen"
export const shortenNomen = (nomen: Nomen) =>
    nomen.filter(
        (part, index, array) =>
            part.class === "scientific" ||
            part.class === "vernacular" ||
            part.class === "operator" ||
            (part.class === "rank" && index < array.length - 1),
    )
export default shortenNomen
