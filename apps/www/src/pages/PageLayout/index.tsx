import { LoaderContext } from "@phylopic/ui"
import { BuildContainer } from "@phylopic/utils-api"
import { FC, ReactNode, useEffect } from "react"
import { SWRConfig, SWRConfiguration } from "swr"
import SearchContainer from "~/search/SearchContainer"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
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
                <PageLoader />
                {aside && <aside key="aside">{aside}</aside>}
                <SearchContainer initialText={initialText}>
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
    )
}
export default PageLayout
