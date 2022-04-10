import { AUTHORIZED_NAMESPACES } from "../constants/AUTHORIZED_NAMESPACES"
import { Identifier } from "../models/Identifier"

export const isIdentifier = (x: unknown): x is Identifier =>
    Array.isArray(x) &&
    x.length === 2 &&
    AUTHORIZED_NAMESPACES.some(([authority, namespace]) => authority === x[0] && namespace === x[1]) &&
    typeof x[2] === "string"
