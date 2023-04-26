import { Nomen } from "@phylopic/utils"
import { FC } from "react"
import NomenView from "~/views/NomenView"
import Container from "../Container"
const EXAMPLE_SCIENTIFIC_NAME: Nomen = [{ class: "scientific", text: "Homo sapiens" }]
const EXAMPLE_VERNACULAR_NAME: Nomen = [{ class: "vernacular", text: "humans" }]
const SearchAside: FC = () => {
    return (
        <aside>
            <Container>
                <p>Use the search bar at the top of the page to search for a group of life forms.</p>
                <p>
                    Names may be scientific (e.g., <NomenView value={EXAMPLE_SCIENTIFIC_NAME} />) or informal (e.g.,{" "}
                    <NomenView value={EXAMPLE_VERNACULAR_NAME} />
                    ).
                </p>
            </Container>
        </aside>
    )
}
export default SearchAside
