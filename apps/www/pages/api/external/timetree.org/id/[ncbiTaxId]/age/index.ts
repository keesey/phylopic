import axios from "axios"
import { NextApiHandler } from "next"
import TIMETREE_API_URL from "~/external/timetree.org/TIMETREE_API_URL"
import fetchField from "~/external/timetree.org/fetchField"
const index: NextApiHandler = async (req, res) => {
    const ncbiTaxId = getString(req.query.ncbiTaxId)
    if (!ncbiTaxId) {
        res.status(404)
        return res.end()
    }
    try {
        const url = `${TIMETREE_API_URL}/mrca/id/${encodeURIComponent(ncbiTaxId)}/age`
        const value = await fetchField(url)
        const numericValue = value ? parseFloat(value) : NaN
        // :TODO: CORS protection
        res.setHeader("cache-control", "immutable,max-age=2592000,stale-if-error")
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify({ value: isFinite(numericValue) ? numericValue : null }))
    } catch (e) {
        res.setHeader("cache-control", "no-cache")
        console.error(e)
        if (axios.isAxiosError(e) && e.response?.status) {
            res.status(e.response.status)
        } else {
            res.status(500)
        }
    }
    res.end()
}
export default index
const getString = (value: string | string[] | undefined) => {
    if (typeof value === "string") {
        return value
    }
    if (value === undefined) {
        return ""
    }
    return value[0]
}
