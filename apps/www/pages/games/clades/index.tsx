import { type Compressed } from "compress-json"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import CladesGame from "~/games/CladesGame"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
type Props = Omit<PageLayoutProps, "children"> & { fallback?: Compressed }
const PageComponent: NextPage<Props> = ({ fallback, ...props }) => (
    <PageLayout {...props}>
        <NextSeo
            additionalMetaTags={[
                {
                    name: "keywords",
                    content: "games,clades,puzzles,connections,phylogeny,taxonomy",
                },
            ]}
            canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/games/clades`}
            description="Clades is a puzzle game from PhyloPic. Sort the silhouette images into groups by their evolutionary ancestry."
        />
        <header>
            <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Games</strong> }]} />
            <h1>Clades Game</h1>
        </header>
        <CladesGame />
    </PageLayout>
)
export default PageComponent
