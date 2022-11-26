import dynamic from "next/dynamic"
import { FC, useState } from "react"
import useEmpty from "~/collections/hooks/useEmpty"
import useOpen from "~/collections/hooks/useOpen"
const Open = dynamic(() => import("./Open"), { ssr: false })
const Closed = dynamic(() => import("./Closed"), { ssr: false })
const CollectionsDrawer: FC = () => {
    const empty = useEmpty()
    const open = useOpen()
    if (empty) {
        return null
    }
    if (open) {
        return <Open />
    }
    return <Closed />
}
export default CollectionsDrawer
