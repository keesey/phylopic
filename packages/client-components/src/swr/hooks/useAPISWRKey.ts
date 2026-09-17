import { URL } from "@phylopic/utils"
import { addBuildToURL } from "@phylopic/utils-api"
import { useContext, useMemo } from "react"
import { BuildContext } from "../../builds"
export const useAPISWRKey = (key: URL | null): URL | null => {
    const [build] = useContext(BuildContext) ?? []
    return useMemo(() => (key && build ? addBuildToURL(key, build) : null), [build, key])
}
