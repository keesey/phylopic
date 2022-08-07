import { useEffect, useState } from "react"
import useAsyncMemo from "~/hooks/useAsyncMemo"
const useImageSize = (source: string | undefined) => {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<Error | undefined>()
    const [size, setSize] = useState<Readonly<[number, number]> | undefined>()
    useEffect(() => {
        setError(undefined)
        setSize(undefined)
        if (source) {
            setPending(true)
            const img = new Image()
            const handleAbort = (_event: Event) => {
                setPending(false)
            }
            const handleLoad = (_event: Event) => {
                setPending(false)
                setSize([img.width, img.height])
            }
            const handleError = (event: ErrorEvent) => {
                setPending(false)
                setError(event.error)
            }
            img.addEventListener("abort", handleAbort)
            img.addEventListener("load", handleLoad)
            img.addEventListener("error", handleError)
            img.src = source
            return () => {
                img.removeEventListener("abort", handleAbort)
                img.removeEventListener("load", handleLoad)
                img.removeEventListener("error", handleError)
            }
        } else {
            setPending(false)
        }
    }, [source])
    return useAsyncMemo(size, error, pending)
}
export default useImageSize
