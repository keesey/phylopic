/* eslint-disable @next/next/no-img-element */
import { MountedOnly } from "@phylopic/ui"
import type { NextPage } from "next"
import { SWRConfig } from "swr"
import AuthContainer from "~/auth/AuthContainer"
import PageHead from "~/metadata/PageHead"
import Farewell from "~/screens_legacy/Farewell"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
const Page: NextPage = () => (
    <SWRConfig>
        <PageLoader />
        <PageHead title="PhyloPic: Contribute" url="https://contribute.phylopic.org/logout" />
        <AuthContainer>
            <header>
                <SiteNav />
            </header>
            <main>
                <MountedOnly>
                    <Farewell />
                </MountedOnly>
            </main>
            <SiteFooter />
        </AuthContainer>
    </SWRConfig>
)
export default Page
