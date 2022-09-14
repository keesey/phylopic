import { normalizeQuery, QueryMatches } from "@phylopic/api-models"
import { getSortIndex } from "@phylopic/ui" // :TODO: move to utils
import { createSearch, stringifyNormalized } from "@phylopic/utils"
import axios from "axios"
import { NextApiHandler } from "next"
const index: NextApiHandler = async (req, res) => {
    try {
        const prefix = getString(req.query.q)
        const suggestions = await getSuggestions(prefix)
        res.setHeader("Content-Type", "application/opensearchdescription+xml")
        res.send(
            stringifyNormalized([
                prefix,
                suggestions.map(suggestion => suggestion.term),
                suggestions.map(suggestion => suggestion.description),
                suggestions.map(suggestion => suggestion.url),
            ]),
        )
    } catch (err) {
        console.error(err)
        res.setHeader("Content-Type", "text/plain")
        res.status(500).send(String(err))
    }
    res.end()
}
export default index
type Suggestion = Readonly<{
    description: string
    term: string
    url: string
}>
const getString = (value: string | string[] | undefined) => {
    if (typeof value === "string") {
        return value
    }
    if (value === undefined) {
        return ""
    }
    return value[0]
}
const getSuggestions = async (prefix: string): Promise<readonly Suggestion[]> => {
    const suggestionBatches: ReadonlyArray<readonly Suggestion[]> = await Promise.all([
        getPhyloPicSuggestions(prefix),
        getOTOLSuggestions(prefix),
        getPBDBSuggestions(prefix),
        getEOLSuggestions(prefix),
    ])
    return suggestionBatches
        .reduce<Suggestion[]>((prev, batch) => [...prev, ...batch], [])
        .filter((value, index, array) => index === 0 || !array.slice(0, index).some(other => other.term === value.term))
        .sort(createSuggestionComparator(prefix))
}
const createSuggestionComparator = (prefix: string) => (a: Suggestion, b: Suggestion) => {
    return (
        getSortIndex(a.term, prefix) - getSortIndex(b.term, prefix) ||
        (a.description === "Illustrated" ? (b.description === "Illustrated" ? 0 : -1) : 1)
    )
}
const sanitizeUniqueName = (name: string) => name.replace(/\s*\([a-z\s+(in|with)[^)]+\)/gi, "")
const getEOLSuggestions = async (prefix: string): Promise<readonly Suggestion[]> => {
    try {
        if (prefix.length >= 2) {
            const response = await axios.get<Readonly<{ results: ReadonlyArray<{ readonly title: string }> }>>(
                "https://eol.org/api/search/1.0.json" +
                    createSearch({
                        key: process.env.NEXT_PUBLIC_EOL_API_KEY,
                        q: prefix,
                    }),
            )
            return response.data.results.map(({ title }) => {
                const term = normalizeQuery(title)
                return {
                    description: "Approximate matches only",
                    term,
                    url: `/search?q=` + encodeURIComponent(term),
                }
            })
        }
    } catch (e) {
        console.error(e)
    }
    return []
}
const getOTOLSuggestions = async (prefix: string): Promise<readonly Suggestion[]> => {
    try {
        if (prefix.length >= 2) {
            const response = await axios.post<ReadonlyArray<{ readonly unique_name: string }>>(
                "https://api.opentreeoflife.org/v3/tnrs/autocomplete_name",
                { name: prefix },
                {
                    headers: { "content-type": "application/json" },
                },
            )
            return response.data.map(({ unique_name }) => {
                const term = normalizeQuery(sanitizeUniqueName(unique_name))
                return {
                    description: "Approximate matches only",
                    term,
                    url: `/search?q=` + encodeURIComponent(term),
                }
            })
        }
    } catch (e) {
        console.error(e)
    }
    return []
}
const getPBDBSuggestions = async (prefix: string): Promise<readonly Suggestion[]> => {
    try {
        if (prefix.length >= 2) {
            const response = await axios.get<Readonly<{ records: ReadonlyArray<{ readonly nam: string }> }>>(
                "https://training.paleobiodb.org/data1.2/taxa/auto.json" + createSearch({ name: prefix }),
            )
            return response.data.records.map(({ nam }) => {
                const term = normalizeQuery(nam)
                return {
                    description: "Approximate matches only",
                    term,
                    url: `/search?q=` + encodeURIComponent(term),
                }
            })
        }
    } catch (e) {
        console.error(e)
    }
    return []
}
const getPhyloPicSuggestions = async (prefix: string): Promise<readonly Suggestion[]> => {
    try {
        if (prefix.length >= 2) {
            const query = normalizeQuery(prefix)
            const response = await axios.get<QueryMatches>(
                process.env.NEXT_PUBLIC_API_URL + "/autocomplete" + createSearch({ query }),
            )
            return response.data.matches.map(match => ({
                description: "Illustrated",
                term: match,
                url: `/search?q=` + encodeURIComponent(match),
            }))
        }
    } catch (e) {
        console.error(e)
    }
    return []
}
