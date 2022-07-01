import { useEffect, useState } from "react"
const useWindowDragHighlight = (active: boolean) => {
    const [value, setValue] = useState(false)
    useEffect(() => {
        if (active) {
            const handleDragOver = (event: DragEvent) => {
                if (
                    Array.from(event.dataTransfer?.items ?? []).some(item => item.kind === "file") ||
                    event.dataTransfer?.files.length
                ) {
                    setValue(true)
                }
            }
            const handleDragOut = (_event: DragEvent) => setValue(false)
            window.addEventListener("dragover", handleDragOver)
            window.addEventListener("dragend", handleDragOut)
            window.addEventListener("dragleave", handleDragOut)
            window.addEventListener("drop", handleDragOut)
            return () => {
                window.removeEventListener("dragover", handleDragOver)
                window.removeEventListener("dragend", handleDragOut)
                window.removeEventListener("dragleave", handleDragOut)
                window.removeEventListener("drop", handleDragOut)
            }
        }
    }, [active])
    return value
}
export default useWindowDragHighlight
