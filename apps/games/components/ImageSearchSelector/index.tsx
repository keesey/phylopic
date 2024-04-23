import { Image } from "@phylopic/api-models"
import { PhyloPicAutocomplete, PhyloPicImageSearch, SearchContainer } from "@phylopic/client-components"
import { BuildContainer } from "@phylopic/utils-api"
import { FC } from "react"
import { Results } from "./Results"
import { SearchInput } from "./SearchInput"
import styles from "./index.module.scss"
export interface Props {
    build: number
    onSelect: (value: Image | undefined) => void
}
export const ImageSearchSelector: FC<Props> = ({ build, onSelect }) => {
    return (
        <section className={styles.main}>
            <BuildContainer initialValue={build}>
                <SearchContainer>
                    <>
                        <PhyloPicAutocomplete />
                        <PhyloPicImageSearch />
                    </>
                    <SearchInput />
                    <Results onSelect={onSelect} />
                </SearchContainer>
            </BuildContainer>
        </section>
    )
}
