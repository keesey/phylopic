import { API } from "@phylopic/api-models"
import { fetchResult } from "@phylopic/utils-api"
import type { GetStaticProps } from "next"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
export type Props = {
    build: number
}
const getBuildStaticProps: GetStaticProps<Props, Record<string, never>> = async () => {
    const key = "https://" + process.env.NEXT_PUBLIC_API_DOMAIN
    const response = await fetchResult<API>(key)
    if (response.status !== "success") {
        return getStaticPropsResult(response)
    }
    const build = response.data.build
    return {
        props: { build },
    }
}
export default getBuildStaticProps
