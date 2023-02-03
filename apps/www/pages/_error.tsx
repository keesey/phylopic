import { NextPage } from "next"
import { NextSeo } from "next-seo"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
export type Props = {
    statusCode: number
}
const Page: NextPage<Props> = ({ statusCode }) => (
    <PageLayout>
        <NextSeo noindex title="PhyloPic: Error" />
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
    </PageLayout>
)
Page.getInitialProps = ({ err, res }) => {
    const statusCode = res?.statusCode ?? err?.statusCode ?? 404
    return { statusCode }
}
export default Page
