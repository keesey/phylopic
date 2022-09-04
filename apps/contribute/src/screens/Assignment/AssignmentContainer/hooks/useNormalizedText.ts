import { normalizeText } from "@phylopic/utils"
import { useMemo } from "react"
import useText from "./useText"
const useNormalizedText = () => {
    const text = useText()
    return useMemo(() => normalizeText(text), [text])
}
export default useNormalizedText
