import { BuildContainer, SearchContainer } from "@phylopic/client-components"
import dynamic from "next/dynamic"
import { type FC, type ReactNode, Suspense } from "react"
import BUILD from "~/build/BUILD"
import CollectionsContainer from "~/collections/context/CollectionsContainer"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import styles from "./index.module.scss"

const FundraiserBanner = dynamic(() => import("~/fundraiser/FundraiserBanner"), { ssr: false })

const Search = dynamic(() => import("./Search"), { ssr: false })

export type Props = {
    aside?: ReactNode
    children: ReactNode
    initialText?: string
}

const PageLayout: FC<Props> = ({ aside, children, initialText }) => {
    return (
        <BuildContainer initialValue={BUILD}>
            <PageLoader />
            {aside && <aside key="aside">{aside}</aside>}
            <FundraiserBanner />
            <SearchContainer initialText={initialText}>
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
        </BuildContainer>
    )
}

export default PageLayout
