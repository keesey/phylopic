import { Contributor } from "@phylopic/api-models"
import { AnchorLink, CountView, NumberView, PaginationContainer } from "@phylopic/ui"
import type { NextPage } from "next"
import PageHead from "~/metadata/PageHead"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import Board from "~/ui/Board"
import Breadcrumbs from "~/ui/Breadcrumbs"
import SiteTitle from "~/ui/SiteTitle"
type Props = Omit<PageLayoutProps, "children">
const PageComponent: NextPage<Props> = props => (
    <PageLayout {...props}>
        <PageHead
            title="PhyloPic: Contributors"
            url="https://www.phylopic.org/contributors"
            description="A list of everyone who has contributed free silhouette images to PhyloPic."
        />
        <PaginationContainer endpoint={process.env.NEXT_PUBLIC_API_URL + "/contributors"}>
            {(contributors, totalContributors) => (
                <>
                    <header>
                        <Breadcrumbs
                            items={[{ children: "Home", href: "/" }, { children: <strong>Contributors</strong> }]}
                        />
                        <h1>Contributors</h1>
                        <p>
                            <CountView value={totalContributors} /> people have contributed silhouette images to{" "}
                            <SiteTitle />.
                        </p>
                    </header>
                    <Board
                        items={(contributors as readonly Contributor[]).map(({ count, name, uuid }) => [
                            uuid,
                            <AnchorLink key={`link:${uuid}`} href={`/contributors/${encodeURIComponent(uuid)}`}>
                                {name || "Anonymous"}
                            </AnchorLink>,
                            <NumberView key={`count:${uuid}`} value={count} />,
                        ])}
                    />
                </>
            )}
        </PaginationContainer>
    </PageLayout>
)
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<Contributor>("/contributors")
