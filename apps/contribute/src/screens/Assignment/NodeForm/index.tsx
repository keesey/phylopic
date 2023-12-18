import {
    GBIFAutocomplete,
    GBIFResolve,
    OTOLAutocomplete,
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
                <GBIFAutocomplete />
                <OTOLAutocomplete />
                <PBDBAutocomplete />
                <PhyloPicNodeSearch />
                <GBIFResolve />
                <OTOLResolve />
                <PBDBResolve />
            </>
            <NodeSearch />
        </SearchContainer>
    )
}
export default NodeForm
