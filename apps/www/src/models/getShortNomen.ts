import { Nomen } from "@phylopic/utils"
const getShortNomen = (name?: Nomen) =>
    name
        ?.filter(
            (part, index, array) =>
                part.class === "scientific" ||
                part.class === "vernacular" ||
                part.class === "operator" ||
                (part.class === "rank" && index < array.length - 1),
        )
        .map(part => part.text)
        .join(" ") || "[Unnamed]"
export default getShortNomen
