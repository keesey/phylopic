import { handleAPIError } from "@phylopic/source-client"
import { isSubmission, Submission } from "@phylopic/source-models"
import { isHash, ValidationError, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import SourceClient from "~/source/SourceClient"
const SUBMISSION_KEYS: ReadonlyArray<keyof Submission> = [
    "attribution",
    "contributor",
    "created",
    "identifier",
    "license",
    "newTaxonName",
    "sponsor",
    "status",
]
const index: NextApiHandler<Submission> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const hash = req.query.hash
        if (!isHash(hash)) {
            throw 404
        }
        client = new SourceClient()
        const submissionClient = client.submission(hash)
        if (!(await submissionClient.exists())) {
            throw 404
        }
        const submission = await submissionClient.get()
        await verifyAuthorization(req.headers, { sub: submission.contributor })
        switch (req.method) {
            case "DELETE": {
                await submissionClient.delete()
                res.status(204)
                break
            }
            case "GET":
            case "HEAD": {
                res.status(200)
                res.json(submission)
                break
            }
            case "OPTIONS": {
                res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PATCH")
                res.status(204)
                break
            }
            case "PATCH": {
                if (!Object.keys(req.body).every(key => SUBMISSION_KEYS.includes(key as keyof Submission))) {
                    throw 400
                }
                const newValue: Submission = {
                    ...submission,
                    ...req.body,
                }
                if (newValue.contributor !== submission.contributor || newValue.created !== submission.created) {
                    throw 400
                }
                const faultCollector = new ValidationFaultCollector(["body"])
                if (!isSubmission(newValue, faultCollector)) {
                    throw new ValidationError(faultCollector.list(), "Invalid payload.")
                }
                await submissionClient.put(newValue)
                res.status(204)
                break
            }
            default: {
                throw 405
            }
        }
    } catch (e) {
        handleAPIError(res, e)
    } finally {
        await client?.destroy()
    }
    res.end()
}
export default index
