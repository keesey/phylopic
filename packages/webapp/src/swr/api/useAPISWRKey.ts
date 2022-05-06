import { URL } from "@phylopic/utils/dist/models/types"
import { useContext, useMemo } from "react"
import BuildContext from "~/builds/BuildContext"
import addBuildToURL from "../../builds/addBuildToURL"
const useAPISWRKey = (key: URL | null): URL | null => {
    const [build] = useContext(BuildContext) ?? []
    return useMemo(() => (key && build ? addBuildToURL(key, build) : key), [build, key])
}
export default useAPISWRKey
