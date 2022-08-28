import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useImage from "~/editing/hooks/useImage"
import useContributor from "~/profile/useContributor"
import SiteTitle from "../SiteTitle"
import DropDownMenu from "./DropDownMenu"
import styles from "./index.module.scss"
import NavItem from "./NavItem"
export type Props = {
    imageUUID?: UUID
}
const SiteNav: FC<Props> = ({ imageUUID }) => {
    const authorized = useAuthorized()
    const contributor = useContributor()
    const enabled = authorized && Boolean(contributor?.name && contributor.name !== INCOMPLETE_STRING)
    const [selected, setSelected] = useState<"account" | "file" | "edit" | "site" | "view" | undefined>()
    const image = useImage(imageUUID)
    return (
        <>
            <nav className={styles.main}>
                <a className={styles.title} onClick={() => setSelected("site")} role="button">
                    <SiteTitle />
                </a>
                <NavItem
                    label="File"
                    disabled={!enabled}
                    onToggle={() => setSelected(selected === "file" ? undefined : "file")}
                    selected={selected === "file"}
                />
                <NavItem
                    label="Edit"
                    disabled={!enabled || !image}
                    onToggle={() => setSelected(selected === "edit" ? undefined : "edit")}
                    selected={selected === "edit"}
                />
                <NavItem
                    label="View"
                    disabled={!enabled}
                    onToggle={() => setSelected(selected === "view" ? undefined : "view")}
                    selected={selected === "view"}
                />
                {enabled && (
                    <>
                        <div className={styles.spacer} role="separator" />
                        <NavItem
                            label={contributor!.name}
                            onToggle={() => setSelected(selected === "account" ? undefined : "account")}
                            selected={selected === "account"}
                        />
                    </>
                )}
            </nav>
            <DropDownMenu image={image} onClose={() => setSelected(undefined)} selected={selected} />
        </>
    )
}
export default SiteNav
