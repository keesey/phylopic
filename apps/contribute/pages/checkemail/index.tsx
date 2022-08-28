/* eslint-disable @next/next/no-img-element */
import type { GetServerSideProps, NextPage } from "next"
import PageLayout from "~/pages/PageLayout"
import CheckEmail from "~/screens/CheckEmail"
import isTTL from "~/ui/TTLSelector/isTTL"
import type { TTL } from "~/ui/TTLSelector/TTL"
type Props = {
    ttl?: TTL
}
const Page: NextPage<Props> = ({ ttl }) => (
    <PageLayout
        head={{
            title: "PhyloPic: Check Your Email",
            url: `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/checkemail`,
        }}
    >
        <CheckEmail ttl={ttl ?? "DAY"} />
    </PageLayout>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const ttl = context.query.ttl
    if (isTTL(ttl)) {
        return { props: { ttl } }
    }
    return { props: {} }
}
