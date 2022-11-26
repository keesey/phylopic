import dynamic from "next/dynamic"
import { FC, useState } from "react"
import useEmpty from "~/collections/hooks/useEmpty"
const Open = dynamic(() => import("./Open"), { ssr: false })
const Closed = dynamic(() => import("./Closed"), { ssr: false })
const CollectionsDrawer: FC = () => {
    const empty = useEmpty()
    if (empty) {
        return null
    }
    const [open, setOpen] = useState(false)
    if (open) {
        return <Open onClose={() => setOpen(false)} />
    }
    return <Closed onOpen={() => setOpen(true)} />
}
export default CollectionsDrawer
