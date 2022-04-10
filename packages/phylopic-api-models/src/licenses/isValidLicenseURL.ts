import { ValidLicenseURL } from "./ValidLicenseURL"
import VALID_LICENSE_URLS from "./VALID_LICENSE_URLS"
export const isValidLicenseURL = (x: unknown): x is ValidLicenseURL => VALID_LICENSE_URLS.has(x as ValidLicenseURL)
export default isValidLicenseURL
