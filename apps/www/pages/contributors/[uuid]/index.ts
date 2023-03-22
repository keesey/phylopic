import { Contributor } from "@phylopic/api-models"
import { isUUIDv4 } from "@phylopic/utils"
import { fetchResult } from "@phylopic/utils-api"
import type { GetServerSideProps, NextPage } from "next"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import getContributorHRef from "~/routes/getContributorHRef"
const PageComponent: NextPage = () => null
export default PageComponent
export const getServerSideProps: GetServerSideProps = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    const contributorKey = process.env.NEXT_PUBLIC_API_URL + "/contributors/" + uuid
    const contributorResult = await fetchResult<Contributor>(contributorKey)
    if (contributorResult.status !== "success") {
        return getStaticPropsResult(contributorResult)
    }
    return {
        redirect: {
            destination: getContributorHRef(contributorResult.data._links.self),
            permanent: false,
        },
    }
}
