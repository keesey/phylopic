/* eslint-disable @next/next/no-img-element */
import { isUUID, normalizeUUID, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import AuthContainer from "~/auth/AuthContainer"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageHead from "~/metadata/PageHead"
import CollectMetadata from "~/screens/CollectMetadata"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
export interface Props {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => (
    <SWRConfig>
        <PageLoader />
        <PageHead
            title="PhyloPic: Uploaded Image"
            url={`https://contribute.phylopic.org/images/uploaded/${encodeURIComponent(uuid)}`}
        />
        <AuthContainer>
            <header>
                <SiteNav />
            </header>
            <main>
                <AuthorizedOnly>
                    <CollectMetadata uuid={uuid} />
                </AuthorizedOnly>
            </main>
            <SiteFooter />
        </AuthContainer>
    </SWRConfig>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const uuid = context.params?.uuid
    if (!isUUID(uuid) || uuid !== normalizeUUID(uuid)) {
        return { notFound: true }
    }
    return {
        props: { uuid },
    }
}
