import { Authority, AuthorizedNamespace, Namespace } from "../types"
export const getAuthorizedNamespace = (authority: Authority, namespace: Namespace): AuthorizedNamespace =>
    [authority, namespace].map(x => encodeURIComponent(x)).join("/")
