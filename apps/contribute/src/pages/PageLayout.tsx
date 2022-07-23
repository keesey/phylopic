import { BuildContainer } from "@phylopic/utils-api"
import { LoaderContext } from "@phylopic/ui"
import { FC, ReactNode } from "react"
import { SWRConfig, SWRConfiguration } from "swr"
import AuthContainer from "~/auth/AuthContainer"
import PageHead, { Props as PageHeadProps } from "~/metadata/PageHead"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import AuthExpirationCountdown from "~/ui/AuthExpirationCountdown"
export type Props = {
    children: ReactNode
    fallback?: SWRConfiguration["fallback"]
    head: PageHeadProps
}
const PageLayout: FC<Props> = ({ children, fallback = {}, head }) => {
    return (
        <SWRConfig key="swrConfig" value={{ fallback }}>
            <LoaderContext.Provider value={{ color: "#fff" }}>
                <PageLoader />
                <PageHead {...head} />
                <BuildContainer>
                    <AuthContainer>
                        <aside>
                            <AuthExpirationCountdown />
                        </aside>
                        <header>
                            <SiteNav />
                        </header>
                        <main>{children}</main>
                        <SiteFooter />
                    </AuthContainer>
                </BuildContainer>
            </LoaderContext.Provider>
        </SWRConfig>
    )
}
export default PageLayout
