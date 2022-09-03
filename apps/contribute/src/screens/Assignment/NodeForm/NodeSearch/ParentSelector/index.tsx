import { PhyloPicAutocomplete, PhyloPicNodeSearch, SearchContainer } from "@phylopic/ui"
import { Identifier, Nomen, stringifyNomen } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import NameView from "~/ui/NameView"
import NoBreak from "~/ui/NoBreak"
import Speech from "~/ui/Speech"
import NameForm from "../../NameForm"
import { SearchEntry } from "../SearchEntry"
import ParentSearch from "./ParentSearch"
export type Props = {
    childName: Nomen
    onComplete: (identifier: Identifier, newTaxonName: string | null) => void
}
export const ParentSelector: FC<Props> = ({ childName, onComplete }) => {
    return (
        <SearchContainer>
            <>
                <PhyloPicAutocomplete />
                <PhyloPicNodeSearch />
            </>
            <Speech mode="system">
                <p>
                    Okay, just checking. Can I get the name of a larger group that <NameView value={childName} /> is
                    part of?
                </p>
            </Speech>
            <NameForm placeholder="more general group" prefix={<NoBreak>Sure, how about&nbsp;</NoBreak>} postfix="?" />
            <ParentSearch childName={childName} onComplete={onComplete} />
        </SearchContainer>
    )
}
export default ParentSelector
