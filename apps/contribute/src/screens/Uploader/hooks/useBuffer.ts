import { useEffect, useState } from "react"
import useAsyncMemo from "~/hooks/useAsyncMemo"
const useBuffer = (file: File | undefined, enabled: boolean) => {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<Error | undefined>()
    const [buffer, setBuffer] = useState<Buffer | undefined>()
    useEffect(() => {
        setError(undefined)
        setBuffer(undefined)
        if (file && enabled) {
            setPending(true)
            setBuffer(undefined)
            let cancelled = false
            ;(async () => {
                try {
                    const result = await file.arrayBuffer()
                    if (!cancelled) {
                        setBuffer(Buffer.from(result))
                    }
                } catch (e) {
                    if (!cancelled) {
                        setError(e as Error)
                    }
                } finally {
                    if (!cancelled) {
                        setPending(false)
                    }
                }
            })()
            return () => {
                cancelled = true
            }
        } else {
            setPending(false)
        }
    }, [enabled, file])
    return useAsyncMemo(buffer, error, pending)
}
export default useBuffer
