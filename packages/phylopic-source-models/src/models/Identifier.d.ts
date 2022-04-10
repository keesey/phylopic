import { UUID } from "."

export type Identifier =
    | Readonly<["eol.org", "pages", string]>
    | Readonly<["gbif.org", "species", string]>
    | Readonly<["irmng.org", "taxname", string]>
    | Readonly<["marinespecies.org", "taxname", string]>
    | Readonly<["opentreeoflife.org", "taxonomy", string]>
    | Readonly<["phylopic.org", "nodes", UUID]>
    | Readonly<["ubio.org", "namebank", string]>
