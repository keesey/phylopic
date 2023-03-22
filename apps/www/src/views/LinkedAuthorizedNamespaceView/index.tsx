import { FC } from "react"
import AuthorizedNamespaceView from "../AuthorizedNamespaceView"
export interface Props {
    short?: boolean
    value: string
}
const HREFS: Record<string, string> = {
    ["eol.org/pages"]: "https://www.eol.org/",
    ["gbif.org/species"]: "https://www.gbif.org/",
    ["irmng.org/taxname"]: "https://www.irmng.org/",
    ["marinespecies.org/taxname"]: "https://www.marinespecies.org/",
    ["ncbi.nlm.nih.gov/taxid"]: "https://www.ncbi.nlm.nih.gov/taxonomy/",
    ["opentreeoflife.org/contexts"]: "https://www.opentreeoflife.github.io/",
    ["opentreeoflife.org/taxonomy"]: "https://www.opentreeoflife.github.io/",
    ["paleobiodb.org/txn"]: "https://paleobiodb.org/",
    ["phylopic.org/nodes"]: "/nodes",
    ["phylopic.org/images"]: "/images",
    ["ubio.org/namebank"]: "http://www.ubio.org/?pagename=namebank",
}
const LinkedAuthorizedNamespaceView: FC<Props> = ({ value, short }) => {
    const href = HREFS[value]
    if (!href) {
        return <AuthorizedNamespaceView value={value} short={short} />
    }
    return (
        <a href={href} rel="external">
            <AuthorizedNamespaceView value={value} short={short} />
        </a>
    )
}
export default LinkedAuthorizedNamespaceView
