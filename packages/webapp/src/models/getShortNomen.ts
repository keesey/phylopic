import { Nomen } from "@phylopic/utils"
const getShortNomen = (name?: Nomen) =>
    name
        ?.filter(part => part.class === "scientific" || part.class === "vernacular" || part.class === "operator")
        .map(part => part.text)
        .join(" ") || "[Unnamed]"
export default getShortNomen
