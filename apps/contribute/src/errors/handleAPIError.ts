import { ValidationError } from "@phylopic/utils"
import { isAWSError } from "@phylopic/utils-aws"
import { NextApiResponse } from "next"
const handleAPIError = (res: NextApiResponse, e: unknown) => {
    if (typeof e === "number") {
        res.status(e)
    } else if (e instanceof ValidationError) {
        res.status(400)
        res.json({ message: e.message, faults: e.faults })
    } else if (isAWSError(e)) {
        console.error(e)
        res.status(e.$metadata.httpStatusCode)
    } else {
        console.error(e)
        res.status(500)
        res.json(String(e))
    }
}
export default handleAPIError
