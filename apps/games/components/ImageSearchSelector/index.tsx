import { Image, ImageWithEmbedded } from "@phylopic/api-models"
import { BuildContainer, PhyloPicAutocomplete, PhyloPicImageSearch, SearchContainer } from "@phylopic/client-components"
import { FC } from "react"
import { Results } from "./Results"
import { SearchInput } from "./SearchInput"
import styles from "./index.module.scss"
import { UUID } from "@phylopic/utils"
export interface Props {
    build: number
    excluded?: ReadonlySet<UUID>
    onSelect: (value: ImageWithEmbedded | undefined) => void
}
export const ImageSearchSelector: FC<Props> = ({ build, excluded, onSelect }) => {
    return (
        <section className={styles.main}>
            <BuildContainer initialValue={build}>
                <SearchContainer>
                    <>
                        <PhyloPicAutocomplete />
                        <PhyloPicImageSearch filter_license_nc={false} />
                    </>
                    <SearchInput />
                    <Results excluded={excluded} onSelect={onSelect} />
                </SearchContainer>
            </BuildContainer>
        </section>
    )
}
