import type { PublicDomainLicenseURL } from "./PublicDomainLicenseURL"
import type { URL } from "./URL"
export type ValidLicenseURL = PublicDomainLicenseURL | (URL & "https://creativecommons.org/licenses/by/4.0/")
