import { MountedOnly } from "@phylopic/ui"
import { EmailAddress, isEmailAddress, isUUIDv4, UUID, ValidationFaultCollector } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import { SWRConfig } from "swr"
import AuthContainer from "~/auth/AuthContainer"
import PageHead from "~/metadata/PageHead"
import Verification from "~/screens/Verification"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
export interface Props {
    email: EmailAddress
    jti: UUID
}
const Page: NextPage<Props> = ({ email, jti }) => (
    <SWRConfig>
        <PageLoader />
        <PageHead
            title="PhyloPic: Email Verification"
            url={`https://contribute.phylopic.org/authorize/${encodeURIComponent(email)}/${encodeURIComponent(uuid)}`}
        />
        <AuthContainer>
            <header>
                <SiteNav />
            </header>
            <main>
                <MountedOnly>
                    <Verification email={email} jti={jti} />
                </MountedOnly>
            </main>
            <SiteFooter />
        </AuthContainer>
    </SWRConfig>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const { email, uuid } = context.params ?? {}
    const faultCollector = new ValidationFaultCollector()
    if (!isEmailAddress(email, faultCollector.sub("email")) || !isUUIDv4(uuid, faultCollector.sub("uuid"))) {
        console.warn(faultCollector.list())
        return { notFound: true }
    }
    return {
        props: { email, jti: uuid } as Props,
    }
}
