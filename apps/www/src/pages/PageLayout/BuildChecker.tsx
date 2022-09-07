import { createSearch } from "@phylopic/utils"
import { useAPIFetcher } from "@phylopic/utils-api"
import { FC, useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"
const BuildChecker: FC = () => {
    const fetcher = useAPIFetcher()
    const [cachebuster, setCachebuster] = useState<string | undefined>()
    useEffect(() => setCachebuster(new Date().valueOf().toString(16)), [])
    useSWRImmutable(`https://${process.env.NEXT_PUBLIC_API_DOMAIN}/${createSearch({ cb: cachebuster })}`, fetcher)
    return null
}
export default BuildChecker
