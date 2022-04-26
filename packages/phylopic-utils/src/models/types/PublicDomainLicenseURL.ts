import { URL } from "./URL"
export type PublicDomainLicenseURL = URL &
    ("https://creativecommons.org/publicdomain/zero/1.0/" | "https://creativecommons.org/publicdomain/mark/1.0/")
