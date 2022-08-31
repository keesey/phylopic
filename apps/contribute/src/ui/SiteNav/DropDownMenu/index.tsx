import { Submission } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { FC } from "react"
import styles from "./index.module.scss"
const AccountMenu = dynamic(() => import("./menus/AccountMenu"), { ssr: false })
const EditMenu = dynamic(() => import("./menus/EditMenu"), { ssr: false })
const FileMenu = dynamic(() => import("./menus/FileMenu"), { ssr: false })
const ViewMenu = dynamic(() => import("./menus/ViewMenu"), { ssr: false })
const SiteMenu = dynamic(() => import("./menus/SiteMenu"), { ssr: false })
export type Props = {
    submission?: Submission & { uuid: UUID }
    selected?: "account" | "edit" | "file" | "site" | "view"
}
const DropDownMenu: FC<Props> = ({ submission, selected }) => {
    const active = selected && (selected !== "edit" || Boolean(submission))
    if (!active) {
        return null
    }
    return (
        <div className={clsx(styles.main, styles[selected])} role="menu">
            <ul>
                {selected === "account" && <AccountMenu />}
                {selected === "edit" && submission && <EditMenu submissionUUID={submission.uuid} />}
                {selected === "file" && <FileMenu submission={submission} />}
                {selected === "site" && <SiteMenu />}
                {selected === "view" && <ViewMenu />}
            </ul>
        </div>
    )
}
export default DropDownMenu
