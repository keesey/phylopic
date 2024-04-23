import React from "react"
import { Loader } from "../../loading/Loader"
export interface InfiniteScrollProps {
    hideLoader?: boolean
    onInViewport?: () => void
    pending?: boolean
}
const STYLE: React.CSSProperties = {
    alignItems: "center",
    display: "flex",
    height: "3rem",
    justifyContent: "center",
    margin: "0 auto",
    padding: "1rem",
    textAlign: "center",
    width: "100%",
}
export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ hideLoader, onInViewport, pending }) => {
    pending = Boolean(pending)
    const [inViewport, setInViewport] = React.useState(false)
    const [element, setElement] = React.useState<HTMLDivElement | null>(null)
    React.useEffect(() => {
        if (element) {
            const observer = new IntersectionObserver(
                entries => {
                    for (const entry of entries) {
                        if (entry.intersectionRatio > 0) {
                            setInViewport(true)
                        } else {
                            setInViewport(false)
                        }
                    }
                },
                {
                    root: null,
                    rootMargin: "200px",
                    threshold: 0,
                },
            )
            observer.observe(element)
            return () => observer.disconnect()
        }
    }, [element])
    React.useEffect(() => {
        if (!pending && inViewport) {
            onInViewport?.()
        }
    }, [inViewport, onInViewport, pending])
    return (
        <div ref={setElement} style={STYLE}>
            {pending && !hideLoader && <Loader />}
            {!pending && " "}
        </div>
    )
}
