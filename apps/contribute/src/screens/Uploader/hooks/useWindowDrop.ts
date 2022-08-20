import { useEffect } from "react"
const useWindowDrop = (setFile?: (file: File | undefined) => void) => {
    useEffect(() => {
        if (setFile) {
            const handleDrop = (event: DragEvent) => {
                event.preventDefault()
                setFile(event.dataTransfer?.files.item(0) ?? undefined)
            }
            window.addEventListener("drop", handleDrop)
            return () => {
                window.removeEventListener("drop", handleDrop)
            }
        }
    }, [setFile])
}
export default useWindowDrop
