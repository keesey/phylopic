import { Data } from "@phylopic/api-models"
import { FaultDetector } from "@phylopic/utils"
import { addBuildToURL, fetchDataAndCheck } from "@phylopic/utils-api"
import { kv } from "@vercel/kv"
import BUILD_KEY from "./BUILD_KEY"
import { AxiosRequestConfig } from "axios"
const get = async <T extends Data>(
    url: string,
    detector: FaultDetector<T>,
    config?: Omit<AxiosRequestConfig, "maxRedirects">,
): Promise<T> => {
    const build = await kv.get<number>(BUILD_KEY)
    if (typeof build === "number") {
        const { data } = await fetchDataAndCheck(
            addBuildToURL(url, build),
            {
                ...config,
                maxRedirects: 0,
            },
            detector,
        )
        return data
    }
    {
        const { data } = await fetchDataAndCheck(url, config, detector)
        await kv.set(BUILD_KEY, data.build)
        return data
    }
}
export default get
