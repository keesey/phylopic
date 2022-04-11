import VALID_LICENSE_URLS from "../constants/VALID_LICENSE_URLS"
import { ValidLicenseURL } from "../types/ValidLicenseURL"
export const isValidLicenseURL = (x: unknown): x is ValidLicenseURL => VALID_LICENSE_URLS.has(x as ValidLicenseURL)
export default isValidLicenseURL
