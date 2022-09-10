import { Authority, Namespace } from "@phylopic/utils"
import resolveOTOL from "./namespaces/resolveOTOL"
import resolvePBDB from "./namespaces/resolvePBDB"
import resolvePhyloPic from "./namespaces/resolvePhyloPic"
import { Resolver } from "./Resolver"
const getResolver = (authority: Authority, namespace: Namespace): Resolver | null => {
    // :TODO: EoL, etc.
    if (authority === "opentreeoflife.org" && namespace === "taxonomy") {
        return resolveOTOL
    }
    if (authority === "paleobiodb.org" && namespace === "txn") {
        return resolvePBDB
    }
    if (authority === "phylopic.org" && namespace === "nodes") {
        return resolvePhyloPic
    }
    return null
}
export default getResolver
