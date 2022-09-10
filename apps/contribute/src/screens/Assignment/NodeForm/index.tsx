import {
    OTOLAutocompleteName,
    OTOLResolve,
    PBDBAutocomplete,
    PBDBResolve,
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
                <PBDBAutocomplete />
                <PhyloPicNodeSearch />
                <OTOLResolve />
                <PBDBResolve />
            </>
            <NodeSearch />
        </SearchContainer>
    )
}
export default NodeForm
