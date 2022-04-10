import { Submission } from "../models/Submission"
import { validateEmailAddress } from "./validateEmailAddress"
import { validateISODateTime } from "./validateISODateTime"
import { validateLicenseURL } from "./validateLicenseURL"
import { validateNodeIdentifier } from "./validateNodeIdentifier"
import { validateText } from "./validateText"
import { validateUUID } from "./validateUUID"
export const validateSubmission = (value: Submission, normalized?: boolean) => {
    if (!value) {
        throw new Error("No submission data.")
    }
    if (!value.created) {
        throw new Error("Missing time of creation.")
    }
    if (!value.contributor) {
        throw new Error("Missing contributor.")
    }
    if (!value.license) {
        throw new Error("Missing license.")
    }
    if (!value.specific) {
        throw new Error("Missing specific node UUID.")
    }
    if (!value.uuid) {
        throw new Error("Missing UUID.")
    }
    if (value.attribution === undefined) {
        if (
            normalized &&
            value.license !== "https://creativecommons.org/publicdomain/mark/1.0/" &&
            value.license !== "https://creativecommons.org/publicdomain/zero/1.0/"
        ) {
            throw new Error("CC-BY licenses require attribution.")
        }
    } else {
        validateText(value.attribution, normalized)
    }
    validateISODateTime(value.created)
    validateEmailAddress(value.contributor)
    validateLicenseURL(value.license)
    if (value.general !== undefined) {
        validateNodeIdentifier(value.general, normalized)
    }
    validateNodeIdentifier(value.specific, normalized)
    if (value.sponsor !== undefined) {
        validateText(value.sponsor, normalized)
    }
    validateUUID(value.uuid, normalized)
}
