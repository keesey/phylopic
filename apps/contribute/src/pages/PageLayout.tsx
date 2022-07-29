import { LoaderContext } from "@phylopic/ui"
import { BuildContainer } from "@phylopic/utils-api"
import { FC, ReactNode } from "react"
import { SWRConfig, SWRConfiguration } from "swr"
import AuthContainer from "~/auth/AuthContainer"
import PageHead, { Props as PageHeadProps } from "~/metadata/PageHead"
import AuthExpirationCountdown from "~/ui/AuthExpirationCountdown"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
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
                <BuildContainer key="build">
                    <AuthContainer key="auth">
                        <aside>
                            <AuthExpirationCountdown key="expiration" />
                        </aside>
                        <header>
                            <SiteNav key="nav" />
                        </header>
                        <main>{children}</main>
                        <SiteFooter key="footer" />
                    </AuthContainer>
                </BuildContainer>
            </LoaderContext.Provider>
        </SWRConfig>
    )
}
export default PageLayout
