import { LicenseURL } from "../licenses/LicenseURL"
import LICENSE_URLS from "../licenses/LICENSE_URLS"
import VALID_LICENSE_URLS from "../licenses/VALID_LICENSE_URLS"
import { Link } from "../models/Link"
import validateLink from "./validateLink"
import { ValidationFault } from "./ValidationFault"
export const validateLicenseLink = (
    link: Link | null,
    property = "license",
    required = false,
    allowLegacyLicenses = false,
) => {
    let faults: readonly ValidationFault[] = validateLink(link, property, required)
    const licenses = allowLegacyLicenses ? LICENSE_URLS : VALID_LICENSE_URLS
    if (link?.href && !licenses.has(link.href as LicenseURL)) {
        faults = [
            ...faults,
            {
                field: `_links.${property}.href`,
                message: `The requested license is not available: ${link.href}`,
            },
        ]
    }
    return faults
}
export default validateLicenseLink
