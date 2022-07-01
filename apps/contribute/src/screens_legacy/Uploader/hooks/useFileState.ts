import { useEffect, useState } from "react"
const useFileState = () => {
    const state = useState<File | undefined>()
    useEffect(() => {
        const [file, setFile] = state
        if (!file) {
            const handleDragOver = (event: DragEvent) => {
                event.preventDefault()
            }
            const handleDrop = (event: DragEvent) => {
                event.preventDefault()
                if (event.dataTransfer?.items?.length) {
                    setFile(
                        Array.from(event.dataTransfer.items)
                            .filter(item => item.kind === "file")[0]
                            ?.getAsFile() ?? undefined,
                    )
                } else if (event.dataTransfer?.files?.length) {
                    setFile(event.dataTransfer.files[0])
                } else {
                    setFile(undefined)
                }
            }
            window.addEventListener("dragover", handleDragOver)
            window.addEventListener("drop", handleDrop)
            return () => {
                window.removeEventListener("dragover", handleDragOver)
                window.removeEventListener("drop", handleDrop)
            }
        }
    }, [state])
    return state
}
export default useFileState
