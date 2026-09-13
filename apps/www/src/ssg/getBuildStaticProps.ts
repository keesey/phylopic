import { API } from "@phylopic/api-models"
import { fetchResult } from "@phylopic/utils-api"
import type { GetStaticProps } from "next"
import BUILD from "~/build/parseBuildFromEnv"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
export type Props = {
    build: number
}
const getBuildStaticProps: GetStaticProps<Props, Record<string, never>> = async () => {
    if (BUILD !== undefined) {
        return {
            props: { build: BUILD },
        }
    }
    const key = process.env.NEXT_PUBLIC_API_URL + "/"
    const response = await fetchResult<API>(key)
    if (response.status !== "success") {
        return getStaticPropsResult(response)
    }
    return {
        props: { build: response.data.build },
    }
}
export default getBuildStaticProps
