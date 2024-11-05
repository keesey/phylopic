import { type Compressed, decompress } from "compress-json"
import { useMemo } from "react"
import type { SWRConfiguration } from "swr"
const useCompressedFallback = (fallback: Compressed | undefined): SWRConfiguration["fallback"] | undefined => {
    return useMemo(() => {
        if (Array.isArray(fallback)) {
            if (typeof decompress !== "function") {
                throw new Error(String(decompress))
            }
            return decompress(fallback)
        }
    }, [fallback])
}
export default useCompressedFallback
