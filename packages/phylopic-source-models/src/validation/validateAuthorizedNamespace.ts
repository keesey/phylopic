import { isAuthorizedNamespace } from "../detection/isAuthorizedNamespace"
import { AuthorizedNamespace } from "../models/AuthorizedNamespace"

export const validateAuthorizedNamespace = (value: AuthorizedNamespace) => {
    if (!isAuthorizedNamespace(value)) {
        throw new Error(`Not a valid authorized namespace: ${JSON.stringify(value)}`)
    }
}
