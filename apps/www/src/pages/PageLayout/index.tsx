import { BuildContainer } from "@phylopic/utils-api"
import dynamic from "next/dynamic"
import { FC, ReactNode, useEffect } from "react"
import { SWRConfig, SWRConfiguration } from "swr"
import SearchContainer from "~/search/SearchContainer"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
const EOLSearch = dynamic(() => import("~/search/sources/EOLSearch"), { ssr: false })
const OTOLAutocompleteName = dynamic(() => import("~/search/sources/OTOLAutocompleteName"), { ssr: false })
const OTOLResolve = dynamic(() => import("~/search/sources/OTOLResolve"), { ssr: false })
const PhyloPicAutocomplete = dynamic(() => import("~/search/sources/PhyloPicAutocomplete"), { ssr: false })
const PhyloPicNodeSearch = dynamic(() => import("~/search/sources/PhyloPicNodeSearch"), { ssr: false })
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
                    <PhyloPicAutocomplete />
                    {/*<PhyloPicImageSearch />*/}
                    <PhyloPicNodeSearch />
                    <OTOLAutocompleteName />
                    <OTOLResolve />
                    <EOLSearch />
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
