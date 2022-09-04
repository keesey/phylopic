import {
    OTOLAutocompleteName,
    OTOLResolve,
    PhyloPicAutocomplete,
    PhyloPicNodeSearch,
    SearchContainer,
} from "@phylopic/ui"
import { FC } from "react"
import NodeSearch from "./NodeSearch"
const NodeForm: FC = () => {
    return (
        <SearchContainer>
            <>
                <PhyloPicAutocomplete />
                <OTOLAutocompleteName />
                <PhyloPicNodeSearch />
                <OTOLResolve />
            </>
            <NodeSearch />
        </SearchContainer>
    )
}
export default NodeForm
