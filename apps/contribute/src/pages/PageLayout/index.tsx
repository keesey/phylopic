import { LoaderContext } from "@phylopic/ui"
import { BuildContainer } from "@phylopic/utils-api"
import { FC, ReactNode, useEffect } from "react"
import { SWRConfig, SWRConfiguration } from "swr"
import AuthContainer from "~/auth/AuthContainer"
import PageHead, { Props as PageHeadProps } from "~/metadata/PageHead"
import AuthExpirationCountdown from "~/ui/AuthExpirationCountdown"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import styles from "./index.module.scss"
type Props = {
    breadcrumbs?: ReactNode
    children: ReactNode
    fallback?: SWRConfiguration["fallback"]
    head: PageHeadProps
}
const PageLayout: FC<Props> = ({ breadcrumbs, children, fallback = {}, head }) => {
    useEffect(() => {
        try {
            document.domain = "phylopic.org"
        } catch (e) {
            console.warn(e)
        }
    }, [])
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
                        <div className={styles.main}>
                            <header>
                                <SiteNav key="nav">{breadcrumbs}</SiteNav>
                            </header>
                            <main>{children}</main>
                            <footer>
                                <SiteFooter key="footer" />
                            </footer>
                        </div>
                    </AuthContainer>
                </BuildContainer>
            </LoaderContext.Provider>
        </SWRConfig>
    )
}
export default PageLayout
