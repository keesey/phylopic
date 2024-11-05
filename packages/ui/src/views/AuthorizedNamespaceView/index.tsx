import type { AuthorizedNamespace } from "@phylopic/utils"
import React from "react"
export interface Props {
    short?: boolean
    value: AuthorizedNamespace
}
const TITLES: Record<AuthorizedNamespace, string> = {
    ["eol.org/pages"]: "Encyclopedia of Life",
    ["gbif.org/species"]: "Global Biodiversity Information Facility",
    ["irmng.org/taxname"]: "Interim Register of Marine and Nonmarine Genera",
    ["marinespecies.org/taxname"]: "World Register of Marine Species",
    ["ncbi.nlm.nih.gov/taxid"]: "National Center for Biotechnology Information",
    ["opentreeoflife.org/contexts"]: "Open Tree of Life: Taxonomic Contexts",
    ["opentreeoflife.org/taxonomy"]: "Open Tree of Life: Taxonomy",
    ["paleobiodb.org/txn"]: "Paleobiology Database",
    ["phylopic.org/nodes"]: "PhyloPic: Taxonomic Nodes",
    ["phylopic.org/images"]: "PhyloPic: Silhouette Images",
    ["ubio.org/namebank"]: "uBio NameBank",
}
const TITLES_SHORT: Record<AuthorizedNamespace, string> = {
    ["eol.org/pages"]: "EoL",
    ["gbif.org/species"]: "GBIF",
    ["irmng.org/taxname"]: "IRMNG",
    ["marinespecies.org/taxname"]: "WoRMS",
    ["ncbi.nlm.nih.gov/taxid"]: "NCBI",
    ["opentreeoflife.org/contexts"]: "OTOL (Contexts)",
    ["opentreeoflife.org/taxonomy"]: "OTOL",
    ["paleobiodb.org/txn"]: "PaleobioDB",
    ["phylopic.org/nodes"]: "PhyloPic",
    ["phylopic.org/images"]: "PhyloPic",
    ["ubio.org/namebank"]: "NameBank",
}
export const AuthorizedNamespaceView: React.FC<Props> = ({ value, short }) => {
    const title = short ? TITLES_SHORT[value] : TITLES[value]
    return title ? (
        short ? (
            <cite>
                <abbr title={TITLES[value]}>{title}</abbr>
            </cite>
        ) : (
            <cite>{title}</cite>
        )
    ) : (
        <code>{value}</code>
    )
}
