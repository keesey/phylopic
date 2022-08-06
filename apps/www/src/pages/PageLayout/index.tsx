import { LoaderContext } from "@phylopic/ui"
import { BuildContainer } from "@phylopic/utils-api"
import { FC, ReactNode } from "react"
import { SWRConfig, SWRConfiguration } from "swr"
import SearchContainer from "~/search/SearchContainer"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
export type Props = {
    build?: number
    children: ReactNode
    fallback?: SWRConfiguration["fallback"]
    initialText?: string
}
const PageLayout: FC<Props> = ({ build, children, fallback = {}, initialText }) => {
    return (
        <SWRConfig value={{ fallback }}>
            <BuildContainer initialValue={build}>
                <LoaderContext.Provider value={{ color: "#00809f" }}>
                    <PageLoader />
                    <SearchContainer initialText={initialText}>
                        <header>
                            <SiteNav />
                        </header>
                        <main>
                            <SearchOverlay>{children}</SearchOverlay>
                        </main>
                        <SiteFooter />
                    </SearchContainer>
                </LoaderContext.Provider>
            </BuildContainer>
        </SWRConfig>
    )
}
export default PageLayout
