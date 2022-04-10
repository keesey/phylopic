import { URL } from "../models/URL"
export type LegacyLicenseURL = URL &
    (
        | "https://creativecommons.org/licenses/by/3.0/"
        | "https://creativecommons.org/licenses/by-nc/3.0/"
        | "https://creativecommons.org/licenses/by-nc-sa/3.0/"
        | "https://creativecommons.org/licenses/by-sa/3.0/"
    )
