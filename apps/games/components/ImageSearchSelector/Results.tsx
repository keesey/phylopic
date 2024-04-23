"use client"
import type { Image } from "@phylopic/api-models"
import { SearchContext } from "@phylopic/client-components"
import { ImageThumbnailView } from "@phylopic/ui"
import { useContext, type FC } from "react"
import styles from "./Results.module.scss"
export interface Props {
    onSelect: (value: Image | undefined) => void
}
export const Results: FC<Props> = ({ onSelect }) => {
    const [state] = useContext(SearchContext) ?? []
    console.debug(state)
    const results = state?.imageResults ?? []
    return (
        <ul className={styles.main}>
            {results.map(result => (
                <li key={result.uuid} className={styles.item}>
                    <button onClick={() => onSelect(result)} className={styles.button}>
                        <ImageThumbnailView value={result} />
                    </button>
                </li>
            ))}
        </ul>
    )
}
