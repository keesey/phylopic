export {}
/*
import fetch, { Request } from "node-fetch"
import { URI } from "phylopic-source-models/src"

const PENDING: Promise<unknown>[] = []
interface SPARQLResponse {
    readonly head: {
        readonly vars: readonly string[]
    }
    readonly results: {
        readonly bindings: ReadonlyArray<
            Readonly<
                Record<
                    string,
                    {
                        readonly type: "literal" | "uri"
                        readonly value: string
                        readonly "xml:lang"?: string
                    }
                >
            >
        >
    }
}
const getExternalLinks = async (namebankIDs?: ReadonlySet<number>): Promise<readonly URI[]> => {
    if (!namebankIDs || !namebankIDs.size) {
        return []
    }
    const previousPromises = [...PENDING]
    const promise = (async (): Promise<readonly string[]> => {
        await Promise.all(previousPromises)
        const namebankIDList = [...namebankIDs]
            .sort()
            .map(id => `'${Number(id)}'`)
            .join(",")
        const sparqlQuery = `SELECT ?item ?uBIO_ID ?EOL_ID WHERE {?item wdt:P4728 ?uBIO_ID. OPTIONAL {?item wdt:P830 ?EOL_ID.} FILTER(?uBIO_ID IN (${namebankIDList}))}`
        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}`
        const headers = {
            Accept: "application/sparql-results+json",
            "User-Agent": "phylopic/2.0 (http://phylopic.org/; keesey+phylopic@gmail.com) phylopic-migrator/0.0",
        }
        console.info(`Looking for matches for uBio NameBank IDs: ${[...namebankIDs].sort().join(", ")}...`)
        const request = new Request(url, { headers })
        const response = await fetch(request)
        if (!response.ok) {
            throw new Error(`Wikidata error: ${response.statusText}.`)
        }
        const queryResponse = (await response.json()) as SPARQLResponse
        const eolIDs = new Set<string>()
        if (queryResponse && queryResponse.results && queryResponse.results.bindings) {
            queryResponse.results.bindings.forEach(binding => {
                if (binding.EOL_ID) {
                    eolIDs.add(binding.EOL_ID.value)
                }
            })
        }
        const result = [...eolIDs].sort().map(id => `https://eol.org/pages/${encodeURIComponent(id)}`)
        console.info(`Found ${result.length} link${result.length === 1 ? "" : "s"}.`)
        return result
    })()
    PENDING.push(promise)
    const result = await promise
    PENDING.splice(PENDING.indexOf(promise), 1)
    return result
}
export default getExternalLinks
*/
