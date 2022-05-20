import { URL } from "@phylopic/utils"
import { useContext, useMemo } from "react"
import BuildContext from "~/builds/BuildContext"
import addBuildToURL from "../../builds/addBuildToURL"
const useAPISWRKey = (key: URL | null): URL | null => {
    const [build] = useContext(BuildContext) ?? []
    return useMemo(() => (key && build ? addBuildToURL(key, build) : null), [build, key])
}
export default useAPISWRKey
