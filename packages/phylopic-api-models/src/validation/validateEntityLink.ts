import { v4 } from "is-uuid"
import { Link } from "../types/Link"
import validateLink from "./validateLink"
import { ValidationFault } from "./ValidationFault"
export const validateEntityLink = (
    link: Link | null,
    property: string,
    entityPath: string,
    entityLabel: string,
    required = false,
    validEmbeds: Iterable<string> = [],
) => {
    let faults: readonly ValidationFault[] = validateLink(link, property, required)
    if (link && link.href && typeof link.href === "string") {
        const pathPrefix = `/${entityPath}/`
        if (!link.href.startsWith(pathPrefix)) {
            faults = [
                ...faults,
                {
                    field: `_links.${property}.href`,
                    message: `Not a valid ${entityLabel} link: "${link.href}".`,
                },
            ]
        } else {
            const [path, query] = link.href.split("?", 2)
            const uuid = path.slice(pathPrefix.length)
            if (!v4(uuid)) {
                faults = [
                    ...faults,
                    {
                        field: `_links.${property}.href`,
                        message: `Not a valid UUID v4: "${uuid}".`,
                    },
                ]
            }
            if (!query) {
                faults = [
                    ...faults,
                    {
                        field: `_links.${property}.href`,
                        message:
                            "Hypertext reference must contain a search query, minimally including the `build` parameter.",
                    },
                ]
            } else {
                const queryParsed = query
                    .split(/&/g)
                    .map(part => part.split("=", 2).map(decodeURIComponent) as [string, string])
                const validEmbedsSet = new Set(validEmbeds)
                let buildFound = false
                for (const [key, value] of queryParsed) {
                    if (key === "build") {
                        buildFound = true
                        const n = parseInt(value, 10)
                        if (!isFinite(n) || n <= 0) {
                            faults = [
                                ...faults,
                                {
                                    field: `_links.${property}.href`,
                                    message: "Build number must be a positive integer.",
                                },
                            ]
                        }
                    }
                    if (key.startsWith("embed_")) {
                        if (!validEmbedsSet.has(key.slice(6))) {
                            faults = [
                                ...faults,
                                {
                                    field: `_links.${property}.href`,
                                    message: `Not a valid embedded property parameters: "${key}".`,
                                },
                            ]
                        }
                        if (value !== "true") {
                            faults = [
                                ...faults,
                                {
                                    field: `_links.${property}.href`,
                                    message: `Embedded property parameters must be set to "true" when present, not "${value}".`,
                                },
                            ]
                        }
                    }
                }
                if (!buildFound) {
                    faults = [
                        ...faults,
                        {
                            field: `_links.${property}.href`,
                            message: "Build number must be included in query.",
                        },
                    ]
                }
            }
        }
    }
    return faults
}
export default validateEntityLink
