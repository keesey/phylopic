import { FC, Fragment, ReactNode, useContext } from "react"
import SearchContext from "../context"
import SearchResults from "../SearchResults"
import styles from "./index.module.scss"
export interface Props {
    children?: ReactNode
}
const SearchOverlay: FC<Props> = ({ children }) => {
    const [state] = useContext(SearchContext) ?? []
    const active = Boolean(state?.focused || state?.text)
    return (
        <div className={styles.main}>
            {active && <SearchResults key="results" />}
            {!active && <Fragment key="content">{children}</Fragment>}
        </div>
    )
}
export default SearchOverlay
