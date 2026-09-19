"use client"
import type { ImageWithEmbedded } from "@phylopic/api-models"
import { SearchContext } from "@phylopic/client-components"
import { ImageThumbnailView } from "@phylopic/ui"
import { useContext, type FC } from "react"
import styles from "./Results.module.scss"
import { UUID } from "@phylopic/utils"
export interface Props {
    excluded?: ReadonlySet<UUID>
    onSelect: (value: ImageWithEmbedded | undefined) => void
}
export const Results: FC<Props> = ({ excluded, onSelect }) => {
    const [state] = useContext(SearchContext) ?? []
    const results = state?.imageResults ?? []
    return (
        <ul className={styles.main}>
            {results
                .filter(result => !excluded?.has(result.uuid))
                .map(result => (
                    <li key={result.uuid} className={styles.item}>
                        <button onClick={() => onSelect(result)} className={styles.button}>
                            <ImageThumbnailView value={result} />
                        </button>
                    </li>
                ))}
        </ul>
    )
}
