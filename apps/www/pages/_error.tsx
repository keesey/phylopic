import { NextPage } from "next"
import { NextSeo } from "next-seo"
import PageLayout from "~/layout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Container from "~/ui/Container"
export type Props = {
    statusCode: number
}
const Page: NextPage<Props> = ({ statusCode }) => (
    <PageLayout>
        <NextSeo noindex title="Error - PhyloPic" />
        <Container>
            <header>
                <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Error</strong> }]} />
                <h1>Error</h1>
            </header>
            <p>Sorry for the inconvenience. Please check back later.</p>
            <table>
                <tbody>
                    <tr>
                        <th>Status Code</th>
                        <td>{statusCode}</td>
                    </tr>
                </tbody>
            </table>
        </Container>
    </PageLayout>
)
Page.getInitialProps = ({ err, res }) => {
    const statusCode = res?.statusCode ?? err?.statusCode ?? 404
    return { statusCode }
}
export default Page
