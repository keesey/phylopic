import { Node } from "@phylopic/source-models"
import normalizeEntity from "./normalizeEntity"
const normalizeNode = <T extends Node>(value: T): T => {
    return {
        ...normalizeEntity(value),
        names: typeof (value as any).names === "string" ? JSON.parse((value as any).names) : value.names,
    }
}
export default normalizeNode
