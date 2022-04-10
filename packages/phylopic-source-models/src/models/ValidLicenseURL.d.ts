import { URL } from "./URL"

export type ValidLicenseURL = URL &
    (
        | "https://creativecommons.org/licenses/by/4.0/"
        | "https://creativecommons.org/publicdomain/zero/1.0/"
        | "https://creativecommons.org/publicdomain/mark/1.0/"
    )
