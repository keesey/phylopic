import { Image } from "@phylopic/api-models"
import { createSearch, isUUIDv4 } from "@phylopic/utils"
import { fetchResult } from "@phylopic/utils-api"
import type { GetServerSideProps, NextPage } from "next"
import BUILD from "~/build/BUILD"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import getImageHRef from "~/routes/getImageHRef"
const PageComponent: NextPage = () => null
export default PageComponent
export const getServerSideProps: GetServerSideProps = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    const imageKey = process.env.NEXT_PUBLIC_API_URL + "/images/" + uuid + createSearch({ build: BUILD })
    const imageResult = await fetchResult<Image>(imageKey)
    if (imageResult.status !== "success") {
        return getStaticPropsResult(imageResult)
    }
    return {
        redirect: {
            destination: getImageHRef(imageResult.data._links.self),
            permanent: false,
        },
    }
}
