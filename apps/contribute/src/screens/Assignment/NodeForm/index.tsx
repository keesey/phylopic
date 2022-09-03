import {
    OTOLAutocompleteName,
    OTOLResolve,
    PhyloPicAutocomplete,
    PhyloPicNodeSearch,
    SearchContainer,
} from "@phylopic/ui"
import { Identifier } from "@phylopic/utils"
import { FC, useState } from "react"
import UserScrollTo from "~/ui/UserScrollTo"
import NameForm from "./NameForm"
import NodeSearch from "./NodeSearch"
export type Props = {
    onComplete: (identifier: Identifier, newTaxonName: string | null) => void
}
const NodeForm: FC<Props> = ({ onComplete }) => {
    return (
        <SearchContainer>
            <>
                <PhyloPicAutocomplete />
                <OTOLAutocompleteName />
                <PhyloPicNodeSearch />
                <OTOLResolve />
            </>
            <NameForm placeholder="Species or other taxonomic group" />
            <NodeSearch onComplete={onComplete} />
            <UserScrollTo />
        </SearchContainer>
    )
}
export default NodeForm
