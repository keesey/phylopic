import { EmailAddress, isEmailAddress, isUUIDv4, UUID, ValidationFaultCollector } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import PageLayout from "~/pages/PageLayout"
const Verification = dynamic(() => import("~/screens/Verification"))
export interface Props {
    email: EmailAddress
    jti: UUID
}
const Page: NextPage<Props> = ({ email, jti }) => (
    <PageLayout
        head={{
            title: "PhyloPic: Authorization",
            url: `https://contribute.phylopic.org/authorize/${encodeURIComponent(email)}/${encodeURIComponent(jti)}`,
        }}
    >
        <Verification email={email} jti={jti} />
    </PageLayout>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const { email, jti } = context.params ?? {}
    const faultCollector = new ValidationFaultCollector()
    if (!isEmailAddress(email, faultCollector.sub("email")) || !isUUIDv4(jti, faultCollector.sub("jti"))) {
        console.warn(faultCollector.list())
        return { notFound: true }
    }
    return {
        props: { email, jti } as Props,
    }
}
