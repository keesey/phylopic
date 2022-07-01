import type { NextPage } from "next"
import { SWRConfig } from "swr"
import AuthContainer from "~/auth/AuthContainer"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageHead from "~/metadata/PageHead"
import Uploader from "~/screens_legacy/Uploader"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
const Page: NextPage = () => (
    <SWRConfig>
        <PageLoader />
        <PageHead title="PhyloPic: Upload New Image" url="https://contribute.phylopic.org/images/new" />
        <AuthContainer>
            <header>
                <SiteNav />
            </header>
            <main>
                <AuthorizedOnly>
                    <Uploader />
                </AuthorizedOnly>
            </main>
            <SiteFooter />
        </AuthContainer>
    </SWRConfig>
)
export default Page
