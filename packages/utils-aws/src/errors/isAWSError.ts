import { AWSError } from "./AWSError.js"
// Duck typing for AWSError.
export const isAWSError = (e: unknown): e is AWSError =>
    typeof e === "object" && typeof (e as AWSError)?.$metadata?.httpStatusCode === "number"
export default isAWSError
