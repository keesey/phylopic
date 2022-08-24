import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { FC } from "react"
import styles from "./index.module.scss"
const AccountMenu = dynamic(() => import("./menus/AccountMenu"), { ssr: false })
const EditMenu = dynamic(() => import("./menus/EditMenu"), { ssr: false })
const FileMenu = dynamic(() => import("./menus/FileMenu"), { ssr: false })
const ViewMenu = dynamic(() => import("./menus/ViewMenu"), { ssr: false })
export type Props = {
    image?: Image & { uuid: UUID }
    onClose: () => void
    selected?: "account" | "file" | "edit" | "view"
}
const DropDownMenu: FC<Props> = ({ image, onClose, selected }) => {
    const active = selected && (selected !== "edit" || Boolean(image))
    if (!active) {
        return null
    }
    return (
        <div className={clsx(styles.main, styles[selected])} role="menu">
            <ul>
                {selected === "account" && <AccountMenu />}
                {selected === "edit" && image && <EditMenu image={image} />}
                {selected === "file" && <FileMenu image={image} />}
                {selected === "view" && <ViewMenu />}
            </ul>
        </div>
    )
}
export default DropDownMenu
