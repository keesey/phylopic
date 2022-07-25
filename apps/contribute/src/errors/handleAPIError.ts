import { isAWSError } from "@phylopic/utils-aws"
import { NextApiResponse } from "next"
const handleAPIError = (res: NextApiResponse, e: unknown) => {
    if (typeof e === "number") {
        res.status(e)
    } else if (isAWSError(e)) {
        console.error(e)
        res.status(e.$metadata.httpStatusCode)
    } else {
        console.error(e)
        res.status(500)
    }
}
export default handleAPIError
