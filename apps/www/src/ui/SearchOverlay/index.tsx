import { SearchContext } from "@phylopic/ui"
import dynamic from "next/dynamic"
import { FC, ReactNode, useContext } from "react"
import styles from "./index.module.scss"
const SearchResults = dynamic(() => import("../SearchResults"), { ssr: false })
export interface Props {
    children?: ReactNode
}
const SearchOverlay: FC<Props> = ({ children }) => {
    const [state] = useContext(SearchContext) ?? []
    const active = Boolean(state?.focused || (state?.text?.length ?? 0) >= 2)
    return (
        <div className={styles.main}>
            {active && <SearchResults />}
            {!active && <>{children}</>}
        </div>
    )
}
export default SearchOverlay
