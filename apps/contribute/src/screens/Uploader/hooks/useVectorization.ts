import { trace } from "potrace"
import { useEffect, useState } from "react"
import useAsyncMemo from "~/utils/useAsyncMemo"
const useVectorization = (buffer: Buffer | undefined, enabled: boolean) => {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<Error | undefined>()
    const [svgData, setSVGData] = useState<string | undefined>()
    useEffect(() => {
        setSVGData(undefined)
        setError(undefined)
        if (buffer && enabled) {
            setPending(true)
            let cancelled = false
            trace(buffer, (error, svg) => {
                if (!cancelled) {
                    if (error) {
                        setError(error)
                    } else {
                        setSVGData(svg)
                    }
                    setPending(false)
                }
            })
            return () => {
                cancelled = true
            }
        } else {
            setPending(false)
        }
    }, [buffer, enabled])
    return useAsyncMemo(svgData, error, pending)
}
export default useVectorization
