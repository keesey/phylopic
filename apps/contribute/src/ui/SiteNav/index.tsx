import { AnchorLink } from "@phylopic/ui"
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
    const [selected, setSelected] = useState<"account" | "file" | "edit" | "view" | undefined>()
    const image = useImage(imageUUID)
    return (
        <>
            <nav className={styles.main}>
                <AnchorLink className={styles.title} href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/`}>
                    <SiteTitle />
                </AnchorLink>
                <NavItem
                    label="File"
                    disabled={!authorized}
                    onToggle={() => setSelected(selected === "file" ? undefined : "file")}
                />
                <NavItem
                    label="Edit"
                    disabled={!authorized || !image}
                    onToggle={() => setSelected(selected === "edit" ? undefined : "edit")}
                />
                <NavItem
                    label="View"
                    disabled={!authorized}
                    onToggle={() => setSelected(selected === "view" ? undefined : "view")}
                />
                {authorized && contributor && (
                    <>
                        <div className={styles.spacer} role="separator" />
                        <NavItem
                            label={contributor.name}
                            onToggle={() => setSelected(selected === "account" ? undefined : "account")}
                        />
                    </>
                )}
            </nav>
            <DropDownMenu image={image} onClose={() => setSelected(undefined)} selected={selected} />
        </>
    )
}
export default SiteNav
