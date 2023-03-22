import { Node } from "@phylopic/api-models"
import { isUUIDv4 } from "@phylopic/utils"
import { fetchResult } from "@phylopic/utils-api"
import type { GetServerSideProps, NextPage } from "next"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import getNodeHRef from "~/routes/getNodeHRef"
const PageComponent: NextPage = () => null
export default PageComponent
export const getServerSideProps: GetServerSideProps = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    const nodeKey = process.env.NEXT_PUBLIC_API_URL + "/nodes/" + uuid
    const nodeResult = await fetchResult<Node>(nodeKey)
    if (nodeResult.status !== "success") {
        return getStaticPropsResult(nodeResult)
    }
    return {
        redirect: {
            destination: getNodeHRef(nodeResult.data._links.self),
            permanent: false,
        },
    }
}
