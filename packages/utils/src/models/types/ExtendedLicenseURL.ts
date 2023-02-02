import { LicenseURL } from "./LicenseURL"
import { URL } from "./URL"
export type ExtendedLicenseURL =
    | LicenseURL
    | (URL &
          (
              | "https://creativecommons.org/licenses/by-nc/4.0/"
              | "https://creativecommons.org/licenses/by-nc-sa/4.0/"
              | "https://creativecommons.org/licenses/by-sa/4.0/"
          ))
