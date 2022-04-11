import { isUUID } from "phylopic-utils/src/models"
import { Entity } from "../types"
export const isEntity = <T>(x: unknown, isValue: (x: unknown) => x is T): x is Entity<T> =>
    typeof x === "object" && x !== null && isUUID((x as Entity<T>).uuid) && isValue((x as Entity<T>).value)
export default isEntity
