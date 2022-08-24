import { useEffect } from "react"
export const useClickOutside = (element: Element | null, callback: () => void) => {
    useEffect(() => {
        const handler = (event: Event) => {
            if (element && !element.contains(event.target as Node | null)) {
                callback()
            }
        }
        document.addEventListener("mousedown", handler)
        document.addEventListener("touchstart", handler)
        return () => {
            document.removeEventListener("mousedown", handler)
            document.removeEventListener("touchstart", handler)
        }
    }, [callback, element])
}
