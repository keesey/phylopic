import { Contributor } from "@phylopic/api-models"
import { CountView, NumberView, PaginationContainer } from "@phylopic/ui"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import Board from "~/ui/Board"
import Breadcrumbs from "~/ui/Breadcrumbs"
import SiteTitle from "~/ui/SiteTitle"
type Props = Omit<PageLayoutProps, "children">
const PageComponent: NextPage<Props> = props => (
    <>
        <PageLayout {...props}>
            <NextSeo
                canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/contributors`}
                description="A list of everyone who has contributed free silhouette images to PhyloPic."
                title="PhyloPic: Contributors"
            />
            <PaginationContainer endpoint={process.env.NEXT_PUBLIC_API_URL + "/contributors"}>
                {(contributors: readonly Contributor[], totalContributors: number) => (
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
                                <Link key={`link:${uuid}`} href={`/contributors/${encodeURIComponent(uuid)}`}>
                                    {name || "Anonymous"}
                                </Link>,
                                <NumberView key={`count:${uuid}`} value={count} />,
                            ])}
                        />
                    </>
                )}
            </PaginationContainer>
        </PageLayout>
    </>
)
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<Contributor>("/contributors")
