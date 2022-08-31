import { handleAPIError } from "@phylopic/source-client"
import { isSubmission, Submission } from "@phylopic/source-models"
import { isUUIDv4, stringifyNormalized, UUID, ValidationError, ValidationFaultCollector } from "@phylopic/utils"
import { NextApiHandler } from "next"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import SourceClient from "~/source/SourceClient"
const index: NextApiHandler<Submission & { uuid: UUID }> = async (req, res) => {
    let client: SourceClient | undefined
    try {
        const uuid = req.query.uuid
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        client = new SourceClient()
        const submissionClient = client.submission(uuid)
        if (!(await submissionClient.exists())) {
            if (req.method === "PUT") {
                const { sub: contributor } = (await verifyAuthorization(req.headers)) ?? {}
                if (!isUUIDv4(contributor)) {
                    throw 401
                }
                const faultCollector = new ValidationFaultCollector(["body"])
                if (!isSubmission(req.body, faultCollector)) {
                    throw new ValidationError(faultCollector.list(), "Invalid payload.")
                }
                await submissionClient.put({
                    ...req.body,
                    contributor,
                    created: new Date().toISOString(),
                    uuid,
                })
                res.status(204)
            } else {
                throw 404
            }
        } else {
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
                    res.setHeader("allow", "DELETE, GET, HEAD, OPTIONS, PATCH, PUT")
                    res.status(204)
                    break
                }
                case "PATCH":
                case "PUT": {
                    const newValue: Submission & { uuid: UUID } = {
                        ...submission,
                        ...req.body,
                        uuid,
                    }
                    if (
                        newValue.contributor !== submission.contributor ||
                        newValue.created !== submission.created ||
                        newValue.uuid !== submission.uuid ||
                        Object.keys(newValue).length !== Object.keys(submission).length
                    ) {
                        throw 400
                    }
                    if (stringifyNormalized(submission) === stringifyNormalized(newValue)) {
                        res.status(304)
                    } else {
                        const faultCollector = new ValidationFaultCollector(["body"])
                        if (!isSubmission(newValue, faultCollector)) {
                            throw new ValidationError(faultCollector.list(), "Invalid payload.")
                        }
                        await submissionClient.put(newValue)
                        res.status(204)
                    }
                    break
                }
                default: {
                    throw 405
                }
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
