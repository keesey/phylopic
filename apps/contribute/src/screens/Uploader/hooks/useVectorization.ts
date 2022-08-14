import { trace } from "potrace"
import { useEffect, useState } from "react"
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
    return { data: svgData, error, pending }
}
export default useVectorization
