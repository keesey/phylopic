import { LoaderContext } from "@phylopic/ui"
import { Hash } from "@phylopic/utils"
import { BuildContainer } from "@phylopic/utils-api"
import type { NextSeoProps } from "next-seo"
import { NextSeo } from "next-seo"
import { FC, PropsWithChildren, ReactNode, useEffect } from "react"
import { SWRConfig, SWRConfiguration } from "swr"
import AuthContainer from "~/auth/AuthContainer"
import AuthExpirationCountdown from "~/ui/AuthExpirationCountdown"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import styles from "./index.module.scss"
type Props = PropsWithChildren<{
    build?: number
    fallback?: SWRConfiguration["fallback"]
    seo?: NextSeoProps
    submissionHash?: Hash
}>
const PageLayout: FC<Props> = ({ build, children, fallback = {}, seo, submissionHash }) => {
    return (
        <SWRConfig value={{ fallback }}>
            <LoaderContext.Provider value={{ color: "#fff" }}>
                <PageLoader />
                <NextSeo {...seo} />
                <BuildContainer initialValue={build}>
                    <AuthContainer>
                        <aside>
                            <AuthExpirationCountdown />
                        </aside>
                        <div className={styles.main}>
                            <header>
                                <SiteNav submissionHash={submissionHash} />
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
