import { EOLSearch, OTOLAutocompleteName, OTOLResolve, PhyloPicAutocomplete, PhyloPicNodeSearch } from "@phylopic/ui"
import { FC } from "react"
const Search: FC = () => (
    <>
        <PhyloPicAutocomplete />
        {/*<PhyloPicImageSearch />*/}
        <PhyloPicNodeSearch />
        <OTOLAutocompleteName />
        <OTOLResolve />
        <EOLSearch />
    </>
)
export default Search
