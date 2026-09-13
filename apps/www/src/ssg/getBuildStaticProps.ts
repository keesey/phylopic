import { API } from "@phylopic/api-models"
import { fetchResult } from "@phylopic/utils-api"
import type { GetStaticProps } from "next"
import parseBuildFromEnv from "~/build/parseBuildFromEnv"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
export type Props = {
    build: number
}
const getBuildStaticProps: GetStaticProps<Props, Record<string, never>> = async () => {
    const envBuild = parseBuildFromEnv()
    if (envBuild !== undefined) {
        return {
            props: { build: envBuild },
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
