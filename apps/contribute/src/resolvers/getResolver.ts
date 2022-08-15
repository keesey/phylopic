import { Authority, Namespace } from "@phylopic/utils"
import resolveOTOL from "./namespaces/resolveOTOL"
import { Resolver } from "./Resolver"
const getResolver = (authority: Authority, namespace: Namespace): Resolver | null => {
    // :TODO: EoL, etc.
    if (authority === "opentreeoflife.org" && namespace === "taxonomy") {
        return resolveOTOL
    }
    return null
}
export default getResolver
