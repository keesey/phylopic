import { SearchContainer } from "@phylopic/ui"
import { BuildContainer } from "@phylopic/utils-api"
import dynamic from "next/dynamic"
import { FC, ReactNode, useEffect } from "react"
import { SWRConfig, SWRConfiguration } from "swr"
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
    fallback?: SWRConfiguration["fallback"]
    initialText?: string
}
const PageLayout: FC<Props> = ({ aside, build, children, fallback = {}, initialText }) => {
    useEffect(() => {
        try {
            document.domain = "phylopic.org"
        } catch (e) {
            console.warn(e)
        }
    }, [])
    return (
        <SWRConfig value={{ fallback }}>
            <BuildContainer initialValue={build}>
                <BuildChecker />
                <PageLoader />
                {aside && <aside key="aside">{aside}</aside>}
                <SearchContainer initialText={initialText}>
                    <Search />
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
        </SWRConfig>
    )
}
export default PageLayout
