import { Node } from "@phylopic/api-models"
import { CountView, PaginationContainer } from "@phylopic/ui"
import type { Compressed } from "compress-json"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import Breadcrumbs from "~/ui/Breadcrumbs"
import NodeListView from "~/views/NodeListView"
type Props = Omit<PageLayoutProps, "children"> & {
    fallback?: Compressed
}
const PageComponent: NextPage<Props> = ({ fallback, ...props }) => (
    <CompressedSWRConfig fallback={fallback}>
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
    </CompressedSWRConfig>
)
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<Node>("/nodes")
