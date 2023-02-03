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
        seo={{
            noindex: true,
            title: "PhyloPic: Check Your Email",
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
