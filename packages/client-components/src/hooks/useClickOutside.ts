import { useEffect } from "react"
export const useClickOutside = (element: Element | null | undefined, callback?: () => void) => {
    useEffect(() => {
        if (callback && element) {
            const handler = (event: Event) => {
                if (!element.contains(event.target as Node | null)) {
                    callback()
                }
            }
            document.addEventListener("mousedown", handler)
            document.addEventListener("touchstart", handler)
            return () => {
                document.removeEventListener("mousedown", handler)
                document.removeEventListener("touchstart", handler)
            }
        }
    }, [callback, element])
}
