import { Name } from "phylopic-source-models/src"
const nameToText = (name: Name, short = false): string => {
    if (!short) {
        return name.map(({ text }) => text).join(" ")
    }
    return name
        .filter(({ class: nClass }) => nClass === "scientific" || nClass === "vernacular" || nClass === "operator")
        .map(({ text }) => text)
        .join(" ")
}
export default nameToText
