import { PublicDomainLicenseURL } from "./PublicDomainLicenseURL"
import { URL } from "./URL"
export type ValidLicenseURL = PublicDomainLicenseURL | (URL & "https://creativecommons.org/licenses/by/4.0/")
