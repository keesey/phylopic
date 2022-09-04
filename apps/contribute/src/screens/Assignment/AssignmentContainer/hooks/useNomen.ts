import { parseNomen } from "parse-nomen"
import { useMemo } from "react"
import useNormalizedText from "./useNormalizedText"
const useNomen = () => {
    const text = useNormalizedText()
    return useMemo(() => parseNomen(text), [text])
}
export default useNomen
