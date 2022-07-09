import React from "react"
import dynamic from "next/dynamic"
import { Loader } from "../../core/Loader"
const PropagateLoader = dynamic(() => import("react-spinners/PropagateLoader"), { ssr: false })
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
    margin: "1rem",
    textAlign: "center",
}
export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ hideLoader, onInViewport, pending }) => {
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
