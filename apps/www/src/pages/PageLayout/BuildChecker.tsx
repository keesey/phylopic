import { useAPIFetcher } from "@phylopic/utils-api";
import { FC } from "react";
import useSWRImmutable from "swr/immutable"
const BuildChecker: FC = () => {
    const fetcher = useAPIFetcher()
    useSWRImmutable(`https://${process.env.NEXT_PUBLIC_API_DOMAIN}/`, fetcher)
    return null
}
export default BuildChecker
