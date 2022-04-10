import { validate } from "email-validator"
import { EmailAddress } from "../models/EmailAddress"

export const validateEmailAddress = (value: EmailAddress) => {
    if (!validate(value)) {
        throw new Error(`Invalid email address: <${value}>.`)
    }
}
