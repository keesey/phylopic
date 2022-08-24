import { LoaderContext } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
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
    children: ReactNode
    fallback?: SWRConfiguration["fallback"]
    head: PageHeadProps
    imageUUID?: UUID
}
const PageLayout: FC<Props> = ({ children, fallback = {}, head, imageUUID }) => {
    useEffect(() => {
        try {
            document.domain = "phylopic.org"
        } catch (e) {
            console.warn(e)
        }
    }, [])
    return (
        <SWRConfig value={{ fallback }}>
            <LoaderContext.Provider value={{ color: "#fff" }}>
                <PageLoader />
                <PageHead {...head} />
                <BuildContainer>
                    <AuthContainer>
                        <aside>
                            <AuthExpirationCountdown />
                        </aside>
                        <div className={styles.main}>
                            <header>
                                <SiteNav imageUUID={imageUUID} />
                            </header>
                            <main>{children}</main>
                            <footer>
                                <SiteFooter />
                            </footer>
                        </div>
                    </AuthContainer>
                </BuildContainer>
            </LoaderContext.Provider>
        </SWRConfig>
    )
}
export default PageLayout
