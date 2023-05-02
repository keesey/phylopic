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
} from "@phylopic/ui"
import { FC } from "react"
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
