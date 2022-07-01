import { FC, ReactNode } from "react"
import { SWRConfig, SWRConfiguration } from "swr"
import AuthContainer from "~/auth/AuthContainer"
import PageHead, { Props as PageHeadProps } from "~/metadata/PageHead"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
export type Props = {
    children: ReactNode
    fallback?: SWRConfiguration["fallback"]
    head: PageHeadProps
}
const PageLayout: FC<Props> = ({ children, fallback, head }) => {
    return (
        <SWRConfig value={{ fallback }}>
            <PageLoader />
            <PageHead {...head} />
            <AuthContainer>
                <header>
                    <SiteNav />
                </header>
                <main>{children}</main>
                <SiteFooter />
            </AuthContainer>
        </SWRConfig>
    )
}
export default PageLayout
