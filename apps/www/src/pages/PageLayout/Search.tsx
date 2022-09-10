import {
    EOLSearch,
    OTOLAutocompleteName,
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
        <OTOLAutocompleteName />
        <OTOLResolve />
        <PBDBAutocomplete />
        <PBDBResolve />
        <EOLSearch />
    </>
)
export default Search
