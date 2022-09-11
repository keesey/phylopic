import { Submission } from "@phylopic/source-models"
import {
    fetchJSON,
    OTOLAutocompleteName,
    OTOLResolve,
    PBDBAutocomplete,
    PBDBResolve,
    PhyloPicAutocomplete,
    PhyloPicNodeSearch,
    SearchContainer,
} from "@phylopic/ui"
import { Hash } from "@phylopic/utils"
import { FC } from "react"
import useSWR from "swr"
import IdentifierView from "~/views/IdentifierView"
import NameRenderer from "~/views/NameRenderer"
import NodeSearch from "./NodeSearch"
export type Props = {
    hash: Hash
}
const IdentifierEditor: FC<Props> = ({ hash }) => {
    const { data } = useSWR<Submission>(`/api/submissions/_/${encodeURIComponent(hash)}`, fetchJSON)
    if (!data) {
        return null
    }
    if (!data.identifier) {
        return <>[Unassigned]</>
    }
    if (data.newTaxonName) {
        return (
            <div>
                <NameRenderer value={data.newTaxonName} /> (<IdentifierView value={data.identifier} short />)
                <br />
                <SearchContainer initialText={data.newTaxonName}>
                    <>
                        <PhyloPicAutocomplete />
                        <OTOLAutocompleteName />
                        <PBDBAutocomplete />
                        <PhyloPicNodeSearch />
                        <OTOLResolve />
                        <PBDBResolve />
                    </>
                    <NodeSearch hash={hash} />
                </SearchContainer>
            </div>
        )
    }
    return (
        <div>
            <IdentifierView value={data.identifier} />
        </div>
    )
}
export default IdentifierEditor
