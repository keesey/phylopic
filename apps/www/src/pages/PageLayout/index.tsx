import { BuildContainer, SearchContainer } from "@phylopic/client-components"
import dynamic from "next/dynamic"
import { FC, ReactNode, Suspense } from "react"
import CollectionsContainer from "~/collections/context/CollectionsContainer"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import styles from "./index.module.scss"
const BuildChecker = dynamic(() => import("./BuildChecker"), { ssr: false })
const Search = dynamic(() => import("./Search"), { ssr: false })
export type Props = {
    aside?: ReactNode
    build?: number
    children: ReactNode
    initialText?: string
}
const PageLayout: FC<Props> = ({ aside, build, children, initialText }) => {
    return (
        <BuildContainer initialValue={build}>
            <Suspense>
                <BuildChecker />
            </Suspense>
            <PageLoader />
            {aside && <aside key="aside">{aside}</aside>}
            <SearchContainer initialText={initialText}>
                <Suspense>
                    <Search />
                </Suspense>
                <CollectionsContainer>
                    <header className={styles.header}>
                        <SiteNav />
                    </header>
                    <main>
                        <SearchOverlay>{children}</SearchOverlay>
                    </main>
                    <SiteFooter />
                </CollectionsContainer>
            </SearchContainer>
        </BuildContainer>
    )
}
export default PageLayout
