import { Contributor } from "@phylopic/api-models"
import { CountView, NumberView, PaginationContainer } from "@phylopic/ui"
import type { Compressed } from "compress-json"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import customEvents from "~/analytics/customEvents"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import getContributorHRef from "~/routes/getContributorHRef"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import Board from "~/ui/Board"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Container from "~/ui/Container"
import SiteTitle from "~/ui/SiteTitle"
type Props = Omit<PageLayoutProps, "children"> & {
    fallback?: Compressed
}
const PageComponent: NextPage<Props> = ({ fallback, ...props }) => (
    <CompressedSWRConfig fallback={fallback}>
        <PageLayout {...props}>
            <NextSeo
                canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/contributors`}
                description="A list of everyone who has contributed free silhouette images to PhyloPic."
                title="Contributors to PhyloPic"
            />
            <Container>
                <PaginationContainer
                    endpoint={process.env.NEXT_PUBLIC_API_URL + "/contributors"}
                    onPage={index => customEvents.loadContributorListPage("contributors", index)}
                >
                    {(contributors: readonly Contributor[], totalContributors: number) => (
                        <>
                            <header>
                                <Breadcrumbs
                                    items={[
                                        { children: "Home", href: "/" },
                                        { children: <strong>Contributors</strong> },
                                    ]}
                                />
                                <h1>Contributors</h1>
                                <p>
                                    <CountView value={totalContributors} /> people have contributed silhouette images to{" "}
                                    <SiteTitle />.
                                </p>
                            </header>
                            <Board
                                items={(contributors as readonly Contributor[]).map(contributor => [
                                    contributor.uuid,
                                    <Link
                                        key={`link:${contributor.uuid}`}
                                        href={getContributorHRef(contributor._links.self)}
                                        onClick={() =>
                                            customEvents.clickContributorLink("contributor_board", contributor)
                                        }
                                    >
                                        {contributor.name || "Anonymous"}
                                    </Link>,
                                    <NumberView key={`count:${contributor.uuid}`} value={contributor.count} />,
                                ])}
                            />
                        </>
                    )}
                </PaginationContainer>
            </Container>
        </PageLayout>
    </CompressedSWRConfig>
)
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<Contributor>("/contributors")
