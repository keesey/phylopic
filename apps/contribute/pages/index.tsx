import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import AuthContainer from "~/auth/AuthContainer"
import PageHead from "~/metadata/PageHead"
import Registration from "~/screens/Registration"
import MountedOnly from "~/ui/MountedOnly"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
const Page: NextPage = () => (
    <SWRConfig>
        <PageLoader />
        <PageHead title="PhyloPic: Contribute" url="https://contribute.phylopic.org/" />
        <AuthContainer>
            <header>
                <SiteNav />
            </header>
            <main>
                <MountedOnly>
                    <Registration />
                </MountedOnly>
            </main>
            <SiteFooter />
        </AuthContainer>
    </SWRConfig>
)
export default Page