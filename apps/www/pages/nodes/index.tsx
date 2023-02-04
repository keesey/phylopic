import { Node } from "@phylopic/api-models"
import { CountView, PaginationContainer } from "@phylopic/ui"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import Breadcrumbs from "~/ui/Breadcrumbs"
import NodeListView from "~/views/NodeListView"
type Props = Omit<PageLayoutProps, "children">
const PageComponent: NextPage<Props> = props => (
    <>
        <PageLayout {...props}>
            <NextSeo
                canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/nodes`}
                description="A list of all taxonomic groups covered by PhyloPic, the open database of freely reusable silhouette images of organisms."
                title="PhyloPic: Taxonomic Groups"
            />
            <PaginationContainer endpoint={process.env.NEXT_PUBLIC_API_URL + "/nodes"}>
                {(nodes, totalNodes) => (
                    <>
                        <header>
                            <Breadcrumbs
                                items={[
                                    { children: "Home", href: "/" },
                                    { children: <strong>Taxonomic Groups</strong> },
                                ]}
                            />
                            <h1>Taxonomic Groups</h1>
                            <p>
                                <CountView value={totalNodes} /> taxonomic groups in the database.
                            </p>
                        </header>
                        <NodeListView short value={nodes as readonly Node[]} />
                    </>
                )}
            </PaginationContainer>
        </PageLayout>
    </>
)
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<Node>("/nodes")
