import { Loader, SearchContext } from "@phylopic/ui"
import dynamic from "next/dynamic"
import { FC, Fragment, ReactNode, Suspense, useContext } from "react"
import styles from "./index.module.scss"
const SearchResults = dynamic(() => import("../SearchResults"), { ssr: false })
export interface Props {
    children?: ReactNode
}
const SearchOverlay: FC<Props> = ({ children }) => {
    const [state] = useContext(SearchContext) ?? []
    const active = Boolean(state?.focused || state?.text)
    return (
        <div className={styles.main}>
            {active && (
                <Suspense fallback={<Loader />}>
                    {" "}
                    <SearchResults key="results" />
                </Suspense>
            )}
            {!active && <Fragment key="content">{children}</Fragment>}
        </div>
    )
}
export default SearchOverlay
