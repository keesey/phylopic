import { Name } from "phylopic-source-models/src"
const stringifyName = (n: Name) => n.map(({ text }) => text).join(" ")
export default stringifyName
