import { Node } from "@phylopic/api-models"
import { CountView, PaginationContainer } from "@phylopic/ui"
import type { NextPage } from "next"
import PageHead from "~/metadata/PageHead"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import Breadcrumbs from "~/ui/Breadcrumbs"
import NodeListView from "~/views/NodeListView"
type Props = Omit<PageLayoutProps, "children">
const PageComponent: NextPage<Props> = props => (
    <PageLayout {...props}>
        <PageHead
            title="PhyloPic: Taxonomic Groups"
            url="https://www.phylopic.org/nodes"
            description="A list of all taxonomic groups covered by PhyloPic, the open database of freely reusable silhouette images of organisms."
        />
        <PaginationContainer endpoint={"https://" + process.env.NEXT_PUBLIC_API_DOMAIN + "/nodes"}>
            {(nodes, totalNodes) => (
                <>
                    <header>
                        <Breadcrumbs
                            items={[{ children: "Home", href: "/" }, { children: <strong>Taxonomic Groups</strong> }]}
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
)
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<Node>("/nodes")
