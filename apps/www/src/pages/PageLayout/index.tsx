import { SearchContainer } from "@phylopic/ui"
import { BuildContainer } from "@phylopic/utils-api"
import dynamic from "next/dynamic"
import { FC, ReactNode, useEffect } from "react"
import { SWRConfig, SWRConfiguration } from "swr"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
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
        <>
            <Analytics />
            <SWRConfig value={{ fallback }}>
                <BuildContainer initialValue={build}>
                    <BuildChecker />
                    <PageLoader />
                    {aside && <aside key="aside">{aside}</aside>}
                    <SearchContainer initialText={initialText}>
                        <Search />
                        <header>
                            <SiteNav />
                        </header>
                        <main>
                            <SearchOverlay>{children}</SearchOverlay>
                        </main>
                        <SiteFooter />
                    </SearchContainer>
                </BuildContainer>
            </SWRConfig>
        </>
    )
}
export default PageLayout
