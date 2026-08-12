import { ValidationError } from "@phylopic/utils"
import { isAWSError } from "@phylopic/utils-aws"
import { NextApiResponse } from "next"
export const handleAPIError = (res: NextApiResponse, e: unknown) => {
    console.error(e)
    if (typeof e === "number") {
        res.status(e)
    } else if (e instanceof ValidationError) {
        res.status(400)
        res.json({ message: e.message, faults: e.faults })
    } else if (isAWSError(e)) {
        res.status(e.$metadata.httpStatusCode ?? 500)
        res.json({ message: "An unexpected error occurred." })
    } else {
        res.status(500)
        res.json({ message: "An unexpected error occurred." })
    }
}
