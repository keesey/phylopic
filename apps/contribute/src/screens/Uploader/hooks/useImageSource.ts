import { useMemo } from "react"
const useImageSource = (buffer: Buffer | undefined, type: string | undefined) => {
    return useMemo(() => {
        if (buffer && type) {
            const blob = new Blob([buffer], { type })
            const urlCreator = window.URL ?? window.webkitURL
            return urlCreator.createObjectURL(blob)
        }
    }, [buffer, type])
}
export default useImageSource
