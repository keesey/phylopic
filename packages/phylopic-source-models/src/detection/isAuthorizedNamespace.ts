import { AUTHORIZED_NAMESPACES } from "../constants/AUTHORIZED_NAMESPACES"
import { AuthorizedNamespace } from "../models/AuthorizedNamespace"

export const isAuthorizedNamespace = (x: unknown): x is AuthorizedNamespace =>
    Array.isArray(x) &&
    x.length === 2 &&
    AUTHORIZED_NAMESPACES.some(([authority, namespace]) => authority === x[0] && namespace === x[1])
