import {
    EOLSearch,
    GBIFAutocomplete,
    GBIFResolve,
    OTOLAutocomplete,
    OTOLResolve,
    PBDBAutocomplete,
    PBDBResolve,
    PhyloPicAutocomplete,
    PhyloPicNodeSearch,
} from "@phylopic/client-components"
import type { FC } from "react"
const Search: FC = () => (
    <>
        <PhyloPicAutocomplete />
        {/*<PhyloPicImageSearch />*/}
        <PhyloPicNodeSearch />
        <GBIFAutocomplete />
        <OTOLAutocomplete />
        <PBDBAutocomplete />
        <GBIFResolve />
        <OTOLResolve />
        <PBDBResolve />
        <EOLSearch />
    </>
)
export default Search
