import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import { GTagAnalytics, LoaderContext, SearchContainer } from "@phylopic/ui"
import dynamic from "next/dynamic"
import { PropsWithChildren, Suspense } from "react"
import CollectionsContainer from "~/collections/context/CollectionsContainer"
import getString from "~/routes/getString"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import styles from "./layout.module.scss"
const Search = dynamic(() => import("~/layout/Search"), { ssr: false })
const Layout = ({ children, params }: PropsWithChildren<{ params: { q?: string | string[] } }>) => {
    return (
        // :TODO LoaderContainer
        <SearchContainer initialText={getString(params.q)}>
            <GTagAnalytics gaMeasurementId={process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID} />
            <VercelAnalytics
             />
            <Suspense>
                <Search />
            </Suspense>
            <CollectionsContainer>
                <header className={styles.header}>
                    <SiteNav />
                </header>
                <main>
                    <SearchOverlay>{children}</SearchOverlay>
                </main>
                <SiteFooter />
            </CollectionsContainer>
        </SearchContainer>
    )
}
export default Layout
