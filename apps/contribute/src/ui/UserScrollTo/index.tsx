import { FC, useEffect, useState } from "react"
const UserScrollTo: FC = () => {
    const [element, setElement] = useState<HTMLElement | null>(null)
    useEffect(() => {
        if (element && typeof window !== "undefined") {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }, [element])
    return <div ref={setElement} aria-hidden />
}
export default UserScrollTo
