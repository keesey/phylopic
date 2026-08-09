import { isArray, isNormalizedText, type ValidationFaultCollector } from "@phylopic/utils"
import { type AuthorizedNamespaces } from "../types/AuthorizedNamespaces"
import { isData } from "./isData"

const isAuthorizedNamespace = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is AuthorizedNamespaces["namespaces"][number] =>
    typeof x === "object" &&
    x !== null &&
    isNormalizedText((x as AuthorizedNamespaces["namespaces"][number]).authority, faultCollector?.sub("authority")) &&
    isNormalizedText((x as AuthorizedNamespaces["namespaces"][number]).namespace, faultCollector?.sub("namespace"))

export const isAuthorizedNamespaces = (
    x: unknown,
    faultCollector?: ValidationFaultCollector,
): x is AuthorizedNamespaces =>
    isData(x, faultCollector) &&
    isArray(isAuthorizedNamespace)((x as AuthorizedNamespaces).namespaces, faultCollector?.sub("namespaces"))
