import { NodeName } from "@phylopic/api-models"
const getShortName = (name: NodeName) =>
    name
        .filter(part => part.class === "scientific" || part.class === "vernacular" || part.class === "operator")
        .map(part => part.text)
        .join(" ")
export default getShortName
