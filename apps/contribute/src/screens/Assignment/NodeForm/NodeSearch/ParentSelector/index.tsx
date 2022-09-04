import { PhyloPicAutocomplete, PhyloPicNodeSearch, SearchContainer } from "@phylopic/ui"
import { FC, useState } from "react"
import useNormalizedText from "~/screens/Assignment/AssignmentContainer/hooks/useNormalizedText"
import NoBreak from "~/ui/NoBreak"
import Speech from "~/ui/Speech"
import NameForm from "../../NameForm"
import NameRenderer from "../../NameRenderer"
import ParentOptions from "./ParentOptions"
export const ParentSelector: FC = () => {
    const childNameText = useNormalizedText()
    const [parentNameText, setParentNameText] = useState("")
    return (
        <SearchContainer>
            <>
                <PhyloPicAutocomplete />
                <PhyloPicNodeSearch />
            </>
            <Speech mode="system">
                <p>
                    Okay, can I get the name of a larger group that <NameRenderer value={childNameText} /> is part of?
                </p>
            </Speech>
            <NameForm
                editable
                onChange={setParentNameText}
                placeholder="more general group"
                prefix={<NoBreak>Sure, how about&nbsp;</NoBreak>}
                postfix="?"
                value={parentNameText}
            />
            <ParentOptions />
        </SearchContainer>
    )
}
export default ParentSelector
