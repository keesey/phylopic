import { useEffect, useState, FC } from "react"
import styles from "./index.module.scss"
import dynamic from "next/dynamic"
const PropagateLoader = dynamic(() => import("react-spinners/PropagateLoader"), { ssr: false })
export interface Props {
    hideLoader?: boolean
    onInViewport?: () => void
    pending?: boolean
}
const InfiniteScroll: FC<Props> = ({ hideLoader, onInViewport, pending }) => {
    const [inViewport, setInViewport] = useState(false)
    const [element, setElement] = useState<HTMLDivElement | null>(null)
    useEffect(() => {
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
    useEffect(() => {
        if (!pending && inViewport) {
            onInViewport?.()
        }
    }, [inViewport, onInViewport, pending])
    return (
        <div className={styles.main} ref={setElement}>
            {pending && !hideLoader && <PropagateLoader color="#0080a0" css="" loading size={15} speedMultiplier={1} />}
            {!pending && " "}
        </div>
    )
}
export default InfiniteScroll
