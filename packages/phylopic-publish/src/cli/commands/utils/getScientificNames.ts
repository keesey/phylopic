import { Nomen } from "phylopic-utils/src/models"
import { isScientific } from "phylopic-utils/src/nomina"
const getScientificNames = (names: readonly Nomen[]) =>
    names.filter(isScientific).map(name =>
        name
            .filter(part => part.class === "scientific")
            .map(part => part.text)
            .join(" "),
    )
export default getScientificNames
