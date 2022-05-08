import { PublicDomainLicenseURL } from "./PublicDomainLicenseURL.js"
import { URL } from "./URL.js"
export type ValidLicenseURL = PublicDomainLicenseURL | (URL & "https://creativecommons.org/licenses/by/4.0/")
